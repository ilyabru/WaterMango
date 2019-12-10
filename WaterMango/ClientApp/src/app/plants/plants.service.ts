import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Plant } from './plant';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

  // run query to get the plants from database
  plants$ = this.http.get<Plant[]>(this.baseUrl + 'plants')
    .pipe(
      map(plants =>
        plants.map(plant => ({    // running map here to initialize the isWatering flag since it does not come from database
          ...plant,
          isWatering: false
        }) as Plant)
      ),
      catchError(this.handleError)  // log the error in console if it occurs
    );

  private plantUpdatedSubject = new BehaviorSubject<Plant>(null);
  plantUpdatedAction$ = this.plantUpdatedSubject.asObservable();

  // combining the plantUpdatedAction$ action stream with the plants$ data stream allows us to to
  // update individual plants inside the array without making extra roundtrips to the server.
  plantsWithUpdates$ = combineLatest([
    this.plants$,
    this.plantUpdatedAction$
  ])
    .pipe(
      map(([plants, updatedPlant]) => {
        if (updatedPlant) {
          // replace the updated plant in array with the new value
          const index = plants.map((p) => p.plantId).indexOf(updatedPlant.plantId);
          if (index > -1) {
            updatedPlant.isWatering = false;
            plants[index] = updatedPlant;
          }
        }

        return plants;
      }),
      catchError(this.handleError)
    );

  plantUpdated(plant: Plant) {
    this.plantUpdatedSubject.next(plant);
  }

  waterPlant(plant: Plant): Observable<Plant> {
    const url = this.baseUrl + 'plants/' + plant.plantId;
    return this.http.put(url, null)
      .pipe(
        // return plant after watering
        map(plantResponse => plantResponse as Plant),
        catchError(this.handleError)
      );
  }


  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
