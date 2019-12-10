import { Component, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subject, interval, Subscription } from 'rxjs';
import { switchMap, mapTo, scan, takeWhile, materialize, dematerialize } from 'rxjs/operators';
import { Plant } from '../plant';
import { PlantsService } from '../plants.service';

@Component({
  selector: 'water-button',
  templateUrl: './water-button.component.html',
  styleUrls: ['./water-button.component.css']
})
export class WaterButtonComponent implements OnChanges, OnDestroy {

  private COUNTDOWN_START = 30;
  private _countdownSource$ = new Subject<any>();

  @Input() plant: Plant;

  output = 'Water';
  state = 1; // 1 - ready to water, 2 - watering, 3 - timeout
  updatePlantSub: Subscription;

  constructor(private plantService: PlantsService) {

    this._countdownSource$
      .pipe(
        // resets counter to new count when _countdownSource$ next() function is called
        switchMap(count =>
          // The following observable will subtract 1 from a acccumulated value(seeded from count) every second.
          // The observable stops emitting after the value becomes 0
          interval(1000).pipe(
            mapTo(-1),
            scan((acc, curr) => (curr ? curr + acc : acc), count),
            takeWhile(v => v >= 0),
            materialize() // need to do this, otherwise onCompleted won't fire
          )
        ),
        dematerialize()
      ).subscribe(
        (val: any) => {
          this.output = val;  // update label with currect countdown value
        },
        (err) => console.log(err),
        () => {
          this.output = 'Water'; // once we reach 0, allow watering
          this.state = 1;
        }
      );
  }

  onWater() {
    if (this.state === 1) {
      this.updatePlantSub = this.plantService.waterPlant(this.plant)
        .subscribe({
          next: (p) => {
            this.plant.isWatering = false;
            this.plantService.plantUpdated(p);
          },
          error: () => this.plant.isWatering = false
        });

      // since the waterPlant method is asynchronous, these statements will run before the observable completes
      this.plant.isWatering = true;
      this.state = 2;
      this.output = 'Stop';

    } else if (this.state === 2) {
      // reset to waterable state
      this.updatePlantSub.unsubscribe();
      this.plant.isWatering = false;
      this.state = 1;
      this.output = 'Start';
    }
  }

  ngOnChanges() {
    const diffInMs = new Date().getTime() - new Date(this.plant.lastWateredDate).getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);

    if (diffInSecs <= this.COUNTDOWN_START) {
      const timeLeft = this.COUNTDOWN_START - diffInSecs;
      this.state = 3;
      this.output = timeLeft.toString();
      this._countdownSource$.next(timeLeft);
    }
  }

  ngOnDestroy() {
    // this._subscription.unsubscribe();
  }

  getStateClass() {
    switch (this.state) {
      case 1: return 'btn-primary';
      case 2: return 'btn-danger';
      case 3: return 'btn-info';
      default: return 'btn-primary';
    }
  }


}
