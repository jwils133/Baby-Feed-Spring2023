import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {FfqParticipant} from "../../models/ffq-participant";

@Injectable({
  providedIn: 'root'
})

export class ParticipantService {

  endpoint = environment.userServiceUrl + '/ffq/participant';

  constructor(private http: HttpClient) {
  }

  addParticipant(user: FfqParticipant): Observable<FfqParticipant> {
    return this.http.post<FfqParticipant>(this.endpoint + '/createparticipant', user,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  //Not required at the time
  updateParticipant(user: FfqParticipant): Observable<any> {
    return this.http.put(this.endpoint + '/updateparticipant', user,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  getParticipant(userId: string): Observable<FfqParticipant> {
    return this.http.get<FfqParticipant>(this.endpoint + '/' + userId);
  }

  getAllParticipants(): Observable<FfqParticipant[]> {
    return this.http.get<FfqParticipant[]>(this.endpoint + '/all');
  }

  //Not required at the time
  deleteItem(userId: string): Observable<any> {
    return this.http.delete(this.endpoint + "/delete?userId=" + userId, {responseType: 'text'})
  }


  addMultipleParticipants(participants: FfqParticipant[]): Observable<FfqParticipant[]> {
    const foo = this.http.post<FfqParticipant[]>(this.endpoint + '/createManyParticipants', participants,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})});

    return foo;

  }
}
