import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { FfqParticipant } from "src/app/models/ffq-participant";
import { environment } from "src/environments/environment";
import { FFQResearcher } from "src/app/models/ffqresearcher";

const httOptions = {
  headers: new HttpHeaders({ "Content-Type": "aplication/json" }),
};

@Injectable({
  providedIn: "root",
})
export class ResearcherParticipantService {
  endpoint = environment.userServiceUrl + "/ffq/participants";
  currentUser = <FFQResearcher>(
    JSON.parse(localStorage.getItem("currentUser"))[0]
  );

  constructor(private http: HttpClient) {}

  addParent(user: FfqParticipant): Observable<any> {
    user.assignedResearcherInst =
      this.currentUser.assignedResearchInstitutionId;
    user.assignedResearcherUsers.push(this.currentUser.userId);

    return this.http
      .post(this.endpoint + "/createparticipants", user, {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      })
      .pipe(
        tap(
          (data) => console.log(data),
          (error) => console.log(error)
        )
      );
  }

  updateParent(user: FfqParticipant): Observable<any> {
    return this.http
      .put(this.endpoint + "/updateparticipants", user, {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      })
      .pipe(
        tap(
          (data) => console.log(data),
          (error) => console.log(error)
        )
      );
  }

  getAllResearchParticipants(): Observable<FfqParticipant[]> {
    return this.http.get(this.endpoint + "/all").pipe(
      map((res: any) => {
        return res.map((item) => {
          return new FfqParticipant(
            item.userId,
            item.username,
            item.usertype,
            item.firstname,
            item.lastname,
            item.assignedResearcherInst,
            item.assignedResearcherUsers,
            item.childrennames,
            item.isactive,
            item.userpassword,
            item.prefix,
            item.children
          );
        });
      })
    );
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
