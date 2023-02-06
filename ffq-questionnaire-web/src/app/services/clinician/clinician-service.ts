import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { FFQClinicianResponse } from 'src/app/models/ffqclinician-response';
import { environment } from 'src/environments/environment';
import {FFQClinician} from "../../models/ffqclinician";

@Injectable({
  providedIn: 'root'
})

export class ClinicianService {

  endpoint = environment.userServiceUrl + '/ffq/clinicians';

  constructor(private http: HttpClient) { }

  addClinician(user : FFQClinician): Observable<FFQClinician> {

    return this.http.post<FFQClinician>(this.endpoint + '/createclinician', user,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

 addMultipleClinicians(clinicians : FFQClinician[]): Observable<FFQClinician[]> {

    return this.http.post<FFQClinician[]>(this.endpoint + '/createManyClinicians', clinicians,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

  updateClinician(user : FFQClinicianResponse): Observable<any> {

    return this.http.put(this.endpoint + '/updateclinician', user,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

  getClinician(userId: string): Observable<FFQClinicianResponse> {
    return this.http.get<FFQClinicianResponse>(this.endpoint + '/' + userId);
  }


  getAllClinicians(): Observable<FFQClinicianResponse[]> {
    return this.http.get<FFQClinicianResponse[]>(this.endpoint + '/all');
  }

  deleteItem(userId: string): Observable <any>{
    return this.http.delete(this.endpoint + "/delete?userId=" + userId,  { responseType: 'text' })
  }
}





