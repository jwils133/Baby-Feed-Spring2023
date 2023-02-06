import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TrackerResultsResponse } from 'src/app/models/trackerresultsresponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackerResultsService {

  endpoint = environment.foodServiceUrl + '/ffq';
  public trackerResult: TrackerResultsResponse
  constructor(private http: HttpClient,
               ) { }

  getAllResults(): Observable<TrackerResultsResponse[]> {
    return this.http.get(this.endpoint + '/tracker/all').pipe(
      map((res: any) => {
        return res.map(item => {
          this.trackerResult = new TrackerResultsResponse(
            item.userId,
            item.age,
            item.date,
            item.responses
          );
          // Goal is not apart of the contructor of a tracker result response object so set them after creating
          this.trackerResult.goal = item.goal;
          return this.trackerResult
        });
      }));
  }

  getResultsByUser(userId: string): Observable<TrackerResultsResponse[]> {
    return this.http.get(this.endpoint + '/tracker/user/' + userId).pipe(
      map((res: any) => {
        return res.map(item => {
            this.trackerResult = new TrackerResultsResponse(
            item.userId,
            item.age,
            item.date,
            item.responses
          );
          // ID and goal are not apart of the contructor of a tracker result response object so set them after creating
          this.trackerResult._id = item.id;
          this.trackerResult.goal = item.goal;
          return this.trackerResult;
        });
      }));
  }
}
