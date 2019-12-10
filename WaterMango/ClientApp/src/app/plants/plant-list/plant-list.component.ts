import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Plant } from '../plant';
import { Observable, EMPTY } from 'rxjs';
import { PlantsService } from '../plants.service';
import { catchError } from 'rxjs/operators';

@Component({
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantListComponent {

  plants$: Observable<Plant[]> = this.plantService.plantsWithUpdates$
    .pipe(
      catchError(() => {
        return EMPTY;
      })
    );

  constructor(private plantService: PlantsService,
    private ref: ChangeDetectorRef) {
    // Run a change detection check every second.
    // I did this so that plants that transition from healthy to dying change their status without refreshing the screen
    setInterval(() => {
      this.ref.markForCheck();
    }, 1000);
  }

  needsWatering(plant: Plant): boolean {
    if (!plant.lastWateredDate && !plant.isWatering) {
      // has not been watered once
      return true;
    }

    // get the number of hours between now and previous water date
    const diffInMs = new Date().getTime() - new Date(plant.lastWateredDate).getTime();
    const diffInHrs = diffInMs / (1000 * 60 * 60);

    if (!plant.isWatering && diffInHrs >= 6) {
      // dying plant
      return true;
    }

    // healthy
    return false;
  }

  getWateringStatusLabel(plant: Plant): string {
    if (plant.isWatering) {
      return 'Watering...';
    } else if (this.needsWatering(plant) && !plant.isWatering) {
      return 'Dying :(';
    } else {
      return 'Healthy';
    }
  }
}
