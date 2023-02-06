import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Description } from 'src/app/models/ffqfooddescription';
import { environment } from 'src/environments/environment';

const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})

export class FoodDescriptionService {

  endpoint = environment.foodServiceUrl + '/ffq';

  constructor(private http: HttpClient) { }

  /* Return the food descriptions given a questionnaire id*/
  getFoodItemByQuestionnaireId(questionnaireId: string): Observable<Description> {
    return this.http.get(this.endpoint + '/fooddescription/' + questionnaireId).pipe(
      map(((item: Description) => {
          return new Description(
            item._id,
            item.imageUrl,
            item.foodItemGroupName,
            item.firstBracketIntake,
            item.secondBracketIntake,
            item.thirdBracketIntake,
            item.description,
          );
        }))
    );
  }

  getAllFoodItems(): Observable<Description[]> {
    return this.http.get(this.endpoint + '/fooddescription/all').pipe(
      map((res: any) => {
        return res.map(item => {
          return new Description(
            item._id,
            item.imageUrl,
            item.foodItemGroupName,
            item.firstBracketIntake,
            item.secondBracketIntake,
            item.thirdBracketIntake,
            item.description,
          );
        });
      }));
  }

  updateFoodItemDescription(_id,payload): Observable<Description[]> {
    return this.http.put(this.endpoint + '/fooddescription/update/'+_id,payload).pipe(
      map((res: any) => {
        return res.map(item => {
          return new Description(
            item._id,
            item.imageUrl,
            item.foodItemGroupName,
            item.firstBracketIntake,
            item.secondBracketIntake,
            item.thirdBracketIntake,
            item.description,
          );
        });
      }));
  }
}
