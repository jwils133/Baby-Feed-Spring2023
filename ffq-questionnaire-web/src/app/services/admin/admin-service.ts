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
import { FFQFoodItemResponse } from 'src/app/models/ffqfooditem-response';
import { FFQAdminResponse } from 'src/app/models/ffqadmin-response';
import { environment } from 'src/environments/environment'
//const mongoose = require('mongoose');
//declare var require: any
//Created by Khalid Alamoudi

const httOptions ={ headers: new HttpHeaders({'Content-Type':'aplication/json'})}

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  endpoint = environment.userServiceUrl + '/ffq/admins';

  constructor(private http: HttpClient) { }

  addUser(user : FFQAdminResponse): Observable<any> {
    return this.http.post(this.endpoint + '/createuser', user,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

  //Still not implemented
  updateUser(user : FFQAdminResponse): Observable<any> {

    return this.http.put(this.endpoint + '/updateuser', user,
      {headers : new HttpHeaders({ 'Content-Type': 'application/json' })});
  }

  //To be implemented
  getUser(userId: string): Observable<FFQAdminResponse> {
    return this.http.get(this.endpoint + '/users/' + userId).pipe(
      map(((item: any) => {
          return new FFQAdminResponse(
            item.userId,
            item.username,
            item.userpassword,
            item.usertype,
            item.firstname,
            item.lastname,
            item.isactive
          );
      }))
    );
  }

  // created by Dariana Gonzalez
  getAllUsers(): Observable<FFQAdminResponse[]> {
   // getMongoUsers();
    return this.http.get(this.endpoint + '/all').pipe(
      map((res: any) => {
        return res.map(item => {
          return new FFQAdminResponse(
            item.userId,
            item.username,
            item.userpassword,
            item.usertype,
            item.firstname,
            item.lastname,
            item.isactive
          );
        });
      })
    );
  }




  /*DELETE: delete food item from the database */
  deleteItem(userId: string): Observable <any>{
    return this.http.delete(this.endpoint + "/delete?userId=" + userId,  { responseType: 'text' })
  }


}


/*export async function getMongoUsers() {  //test function to get users from mongoDB

  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb://localhost:27017/";
  const db = await MongoClient.connect(url);
  const dbo = db.db("ffq_database");
  var user = await dbo.collection("users").find().toArray();    //[{1, Admin}, {2, Khalid}]
  }*/


