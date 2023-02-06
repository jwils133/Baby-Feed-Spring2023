import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FFQItemResponse} from '../../models/ffqitem-response';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {FFQItemCalcRequest} from '../../models/ffqitem-calc-request';
import { FFQFoodNutrientsResponse } from 'src/app/models/ffqfoodnutrients-response';
import { FFQFoodItem } from 'src/app/models/ffqfooditem';
import { ɵangular_packages_forms_forms_q } from '@angular/forms';
import { Http, Headers, Response, RequestOptions, RequestMethod } from '@angular/http';
import { FFQNutrientlist } from 'src/app/models/ffqnutrientlist';
import { environment } from 'src/environments/environment';

const httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})

export class NutrientsService {

  endpoint = environment.foodServiceUrl + '/ffq';

  constructor(private http: HttpClient) { }

  /* Return a specific nutrients list (by object id)*/
  getNutrientsById(objectId: string): Observable<FFQNutrientlist> {
    return this.http.get(this.endpoint + '/nutrients/' + objectId).pipe(
      map(((item: FFQNutrientlist) => {
          return new FFQNutrientlist(
            item.nutrientListID,
            item.nutrientMap
          );
        }))
    );
  }
}
