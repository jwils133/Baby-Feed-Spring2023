import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { FFQResearcherParentResponse } from "src/app/models/ffqresearcherparent-response";
import { environment } from "src/environments/environment";
import { FfqParticipant } from "src/app/models/ffq-participant";

const httOptions = {
  headers: new HttpHeaders({ "Content-Type": "aplication/json" }),
};

@Injectable({
  providedIn: "root",
})
export class ResearcherParentService {
  endpoint = environment.userServiceUrl + "/ffq/participant";

  constructor(private http: HttpClient) {}

  // addParent(user : FFQResearcherParentResponse): Observable<any> {

  //   return this.http.post(this.endpoint + '/createparent', user, {headers : new HttpHeaders({ 'Content-Type': 'application/json' })}).pipe(
  //     tap(
  //       data => console.log(data),
  //       error => console.log(error)
  //     ));
  // }

  // updateParent(user : FFQResearcherParentResponse): Observable<any> {

  //   return this.http.put(this.endpoint + '/updateparent', user, {headers : new HttpHeaders({ 'Content-Type': 'application/json' })}).pipe(
  //     tap(
  //       data => console.log(data),
  //       error => console.log(error)
  //     ));
  // }

  getParent(userId: string): Observable<FFQResearcherParentResponse> {
    return this.http.get(this.endpoint + "/" + userId).pipe(
      map((item: any) => {
        return new FFQResearcherParentResponse(
          item.userId,
          item.username,
          item.userpassword,
          item.usertype,
          item.firstname,
          item.lastname,
          item.assignedResearcherOrg,
          item.assignedResearcherUser,
          item.childrennames,
          item.isactive,
          item.prefix
        );
      })
    );
  }

  getAllParticipants(instID: string): Observable<FfqParticipant[]> {
    return this.http.get(this.endpoint + "/all/" + instID).pipe(
      map((res: any) => {
        return res.map((item) => {
          return new FfqParticipant(
            item.userId,
            item.username,
            item.userpassword,
            item.usertype,
            item.firstname,
            item.lastname,
            item.assignedResearcherInst,
            item.assignedResearcherUser,
            item.childrennames,
            item.isactive,
            item.prefix,
            item.children
          );
        });
      })
    );
  }

  getAllParents(): Observable<FFQResearcherParentResponse[]> {
    return this.http.get(this.endpoint + "/all").pipe(
      map((res: any) => {
        return res.map((item) => {
          return new FFQResearcherParentResponse(
            item.userId,
            item.username,
            item.userpassword,
            item.usertype,
            item.firstname,
            item.lastname,
            item.assignedResearcherOrg,
            item.assignedResearcherUser,
            item.childrennames,
            item.isactive,
            item.prefix
          );
        });
      })
    );
  }

  /*DELETE: delete food item from the database */
  deleteItem(userId: string): Observable<any> {
    console.log("here" + userId);
    return this.http.delete(this.endpoint + "/delete?userId=" + userId, {
      responseType: "text",
    });
  }
}

/*export async function getMongoUsers() {  //test function to get users from mongoDB

  const MongoClient = require('mongodb').MongoClient;
  const url = "mongodb://localhost:27017/";
  const db = await MongoClient.connect(url);
  const dbo = db.db("ffq_database");
  var user = await dbo.collection("users").find().toArray();    //[{1, Admin}, {2, Khalid}]
  console.log(user);

}*/
