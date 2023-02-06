import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrackerResultsResponse } from 'src/app/models/trackerresultsresponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackerResponseService {

  endpoint = environment.foodServiceUrl + '/ffq';

  constructor(private http: HttpClient) { }

  submitTracker(results: TrackerResultsResponse): Observable<any> {
    return this.http.post(this.endpoint + '/tracker', results);
  }


  /* Function used when setting "Goal for next week"
     Makes a PUT request to /tracker/update which is picked up in the Tracker Results Controller
  */
  submitGoal(_id: string, goal: string): Observable<any> {
    return this.http.put(this.endpoint + '/tracker/update', {
      id: _id,
      goal: goal
    },{ headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

}
