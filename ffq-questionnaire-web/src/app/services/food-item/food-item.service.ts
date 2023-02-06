import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FFQItemResponse} from '../../models/ffqitem-response';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FFQItemCalcRequest} from '../../models/ffqitem-calc-request';
import {FFQFoodNutrientsResponse} from 'src/app/models/ffqfoodnutrients-response';
import {FFQFoodItemResponse} from 'src/app/models/ffqfooditem-response';
import {FFQFoodItem} from 'src/app/models/ffqfooditem';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class FoodItemService {
  endpoint = environment.foodServiceUrl + '/ffq';

  constructor(private http: HttpClient) {
  }

  addFoodNutrients(fooditem: FFQFoodNutrientsResponse): Observable<any> {

    return this.http.post(this.endpoint + '/createfoodnutrients', fooditem,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  updateFoodNutrients(fooditem: FFQFoodNutrientsResponse): Observable<any> {

    return this.http.put(this.endpoint + '/updatefoodnutrients', fooditem,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  updateItemPosition(fooditem: FFQFoodItem): Observable<any> {
    return this.http.put(this.endpoint + '/update', fooditem,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  /* Return a specific food item (by object id) and its list of nutrients*/
  getFoodbyName(objectId: string): Observable<FFQFoodNutrientsResponse> {
    return this.http.get(this.endpoint + '/foodnutrients/' + objectId).pipe(
      map(((item: any) => {
        return new FFQFoodNutrientsResponse(
          item.foodItem,
          item.nutrientList
        );
      })));
  }

  // created by Dariana Gonzalez
  getAllFoods(): Observable<FFQFoodItemResponse[]> {
    // getMongoUsers();
    return this.http.get(this.endpoint + '/allfoodsnutrients').pipe(
      map((res: any) => {
        return res.map(item => {
          return new FFQFoodItemResponse(
            item.name,
            item.id,
            item.itemPosition
          );
        });
      }));
  }

  getFoodItems(): Observable<FFQItemResponse[]> {
    return this.http.get(this.endpoint + '/fooditems').pipe(
      map((res: any) => {
        return res.map(item => {
          return new FFQItemResponse(
            item.name,
            item.primary,
            item.servingsList,
            item.foodTypes,
            item.sugar,
            item.itemPosition
          );
        });
      }));
  }

  calculateNutrientBreakdown(userId: string, id: string, userType: string, infantage: number, gender: string, patientName: string, items: FFQItemCalcRequest[]): Observable<any> {
    return this.http.post(`${this.endpoint}/calculate/` + id + `/` + infantage + `/` + userType + '/' + userId + `/` + gender + '/' + patientName, items).pipe(map(data => {
        return data;
      }
    ));
  }

  /*DELETE: delete food item from the database */
  deleteItem(objectId: string): Observable<any> {
    return this.http.delete(this.endpoint + '/delete?id=' + objectId, {responseType: 'text'});
  }


}



