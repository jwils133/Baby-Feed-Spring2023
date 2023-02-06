import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClinicService {

  endpoint = environment.userServiceUrl + '/ffq/clinics';

  constructor(private http: HttpClient) { }

  addClinic(user : FFQClinicResponse): Observable<any> {

    return this.http.post(this.endpoint + '/createclinic', user,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

  updateClinic(user : FFQClinicResponse): Observable<any> {

    return this.http.put(this.endpoint + '/updateclinic', user,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

  getClinic(clinicId: string): Observable<FFQClinicResponse> {
    return this.http.get<FFQClinicResponse>(this.endpoint + '/' + clinicId);
  }


  getAllClinics(): Observable<FFQClinicResponse[]> {
    return this.http.get<FFQClinicResponse[]>(this.endpoint + '/all');
  }

  /*DELETE: delete food item from the database */
  deleteItem(clinicId: string): Observable <any>{
    return this.http.delete(this.endpoint + "/delete?clinicId=" + clinicId,  { responseType: 'text' })
  }


}




