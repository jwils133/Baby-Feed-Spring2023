import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { FFQResultsResponse } from 'src/app/models/ffqresultsresponse';
import { environment } from 'src/environments/environment';

// Added by Dariana Gonzalez on 10/13/2019

const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})

export class ResultsService {

  endpoint = environment.foodServiceUrl + '/ffq/results';

  constructor(private http: HttpClient) { }

  getAllResults(): Observable<FFQResultsResponse[]> {
    return this.http.get(this.endpoint + '/all').pipe(
      map((res: any) => {
        return res.map(item => {
          return new FFQResultsResponse(
            item.questionnaireId,
            item.userId,
            item.userType,
            item.date,
            item.patientName,
            item.ageInMonths,
            item.userChoices,
            item.weeklyTotals,
            item.dailyAverages,
            item.feedback,
            item.gender,
            item.patientName
          );
        });
      }));
    }

    getResultsByUser(userId: string): Observable<FFQResultsResponse[]> {
      return this.http.get(this.endpoint + '/parent/' + userId).pipe(
        map((res: any) => {
          return res.map(item => {
            return new FFQResultsResponse(
              item.questionnaireId,
              item.userId,
              item.userType,
              item.date,
              item.patientName,
              item.ageInMonths,
              item.userChoices,
              item.weeklyTotals,
              item.dailyAverages,
              item.feedback,
              item.gender,
              item.patientName
            );
          });
        }));
      }

      getResultsByUserType(userType: string): Observable<FFQResultsResponse[]> {
        return this.http.get(this.endpoint + '/type/' + userType).pipe(
          map((res: any) => {
            return res.map(item => {
              return new FFQResultsResponse(
                item.questionnaireId,
                item.userId,
                item.userType,
                item.date,
                item.patientName,
                item.ageInMonths,
                item.userChoices,
                item.weeklyTotals,
                item.dailyAverages,
                item.feedback,
                item.gender,
                item.patientName
              );
            });
          }));
        }

  deleteItem(questionnaireId: string): Observable<any> {
    return this.http.delete(this.endpoint + '/delete?questionnaireId=' + questionnaireId, {responseType: 'text'});
  }

  submitFeedback(id: string, feedback: string): Observable<any> {
        return this.http.put(this.endpoint + '/update', {
          questionnaireId: id,
          feedback: feedback
        });
      }

  deleteItemsByParentId(parentId: string): Observable<any> {
    return this.http.delete(this.endpoint + '/delete?parentId=' + parentId, {responseType: 'text'});
  }
  }
