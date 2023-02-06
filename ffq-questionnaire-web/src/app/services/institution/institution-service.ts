import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { FFQInstitutionResponse } from 'src/app/models/ffqinstitution-response';
import { environment } from 'src/environments/environment';


const httOptions ={ headers: new HttpHeaders({'Content-Type':'aplication/json'})}

@Injectable({
  providedIn: 'root'
})



export class InstitutionService {

  endpoint = environment.userServiceUrl + '/ffq/research_institution';


  constructor(private http: HttpClient) { }

  addInstitution(user : FFQInstitutionResponse): Observable<any> {

    return this.http.post(this.endpoint + '/createinstitution', user, {headers : new HttpHeaders({ 'Content-Type': 'application/json' })}).pipe(
      tap(
        data => console.log(data),
        error => console.log(error)
      ));
  }

  updateInstitution(user : FFQInstitutionResponse): Observable<any> {

    return this.http.put(this.endpoint + '/updateinstitution', user, {headers : new HttpHeaders({ 'Content-Type': 'application/json' })}).pipe(
      tap(
        data => console.log(data),
        error => console.log(error)
      ));
  }


  getInstitution(clinicId: string): Observable<FFQInstitutionResponse> {
    return this.http.get<FFQInstitutionResponse>(this.endpoint + '/' + clinicId);
  }


  getAllInstitutions(): Observable<FFQInstitutionResponse[]> {
    return this.http.get<FFQInstitutionResponse[]>(this.endpoint + '/all');
  }

  /*DELETE: delete food item from the database */
  deleteItem(inst: string): Observable <any>{
    console.log("here" + inst);
    return this.http.delete(this.endpoint + "/delete?clinicId=" + inst,  { responseType: 'text' })
  }


}




