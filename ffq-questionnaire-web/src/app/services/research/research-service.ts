import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {FFQResearcher} from "../../models/ffqresearcher";

@Injectable({
  providedIn: 'root',
})
export class ResearchService {
  endpoint = environment.userServiceUrl + '/ffq/researchers';

  constructor(private http: HttpClient) {}

  addResearcher(user: FFQResearcher): Observable<any> {
    return this.http
      .post(this.endpoint + '/createuser', user, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      });
  }

  addMultipleResearchers(user: FFQResearcher[]): Observable<any> {
    return this.http
      .post(this.endpoint + '/createMany', user, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap(
          (data) => console.log(data),
          (error) => console.log(error)
        )
      );
  }

  // Still not implemented
  updateUser(user: FFQResearcher): Observable<any> {
    return this.http
      .put(this.endpoint + '/updateuser', user, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      });
  }

  // To be implemented
  getUser(userId: string): Observable<FFQResearcher> {
    return this.http.get(this.endpoint + '/users/' + userId).pipe(
      map((item: any) => {
        return new FFQResearcher(
          item.userId,
          item.username,
          item.userpassword,
          item.usertype,
          item.firstname,
          item.lastname,
          item.isactive,
          item.assignedResearchInstitutionId,
          item.limitNumberOfParticipants,
          item.prefix
        );
      })
    );
  }

// To be implemented
  getUserById(userId: string): Observable<FFQResearcher> {
    return this.http.get(this.endpoint + '/' + userId).pipe(
      map((item: any) => {
        return new FFQResearcher(
          item.userId,
          item.username,
          item.userpassword,
          item.usertype,
          item.firstname,
          item.lastname,
          item.isactive,
          item.assignedResearchInstitutionId,
          item.limitNumberOfParticipants,
          item.prefix
        );
      })
    );
  }

  getAllUsers(): Observable<FFQResearcher[]> {
    // getMongoUsers();
    return this.http.get(this.endpoint + '/all').pipe(
      map((res: any) => {
        return res.map((item) => {
          return new FFQResearcher(
            item.userId,
            item.username,
            item.userpassword,
            item.usertype,
            item.firstname,
            item.lastname,
            item.isactive,
            item.assignedResearchInstitutionId,
            item.limitNumberOfParticipants,
            item.prefix
          );
        });
      })
    );
  }

  /*DELETE: delete food item from the database */
  deleteItem(userId: string): Observable<any> {
    return this.http.delete(this.endpoint + '/delete?userId=' + userId, {
      responseType: 'text',
    });
  }
}

/*export async function getMongoUsers() {  //test function to get users from mongoDB

  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb://localhost:27017/";
  const db = await MongoClient.connect(url);
  const dbo = db.db("ffq_database");
  var user = await dbo.collection("users").find().toArray();    //[{1, Admin}, {2, Khalid}]
  }*/
