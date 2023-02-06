import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FFQParentResponse } from "src/app/models/ffqparent-response";
import { environment } from "src/environments/environment";
import { FFQParent } from "../../models/ffqparent";

@Injectable({
  providedIn: "root",
})
export class ParentService {
  endpoint = environment.userServiceUrl + "/ffq/parents";
  public parent: FFQParentResponse;

  constructor(private http: HttpClient) {}

  addParent(user: FFQParentResponse): Observable<FFQParent> {
    return this.http.post<FFQParent>(this.endpoint + "/createparent", user, {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    });
  }

  updateParent(user: FFQParentResponse): Observable<any> {
    return this.http.put(this.endpoint + "/updateparent", user, {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    });
  }

  getParent(userId: string): Observable<FFQParentResponse> {
    return this.http.get(this.endpoint + "/" + userId).pipe(
      map((item: any) => {
        return new FFQParentResponse(
          item.userId,
          item.username,
          item.userpassword,
          item.usertype,
          item.firstname,
          item.lastname,
          item.assignedclinic,
          item.assignedclinician,
          item.childrennames,
          item.isactive,
          item.prefix,
          item.lastReadRecommend,
          item.timesOfReading,
          item.children
        );
      })
    );
  }

  getAllParents(): Observable<FFQParentResponse[]> {
    return this.http.get(this.endpoint + "/all").pipe(
      map((res: any) => {
        return res.map((item) => {
          this.parent = new FFQParentResponse(
            item.userId,
            item.username,
            item.userpassword,
            item.usertype,
            item.firstname,
            item.lastname,
            item.assignedclinic,
            item.assignedclinician,
            item.childrennames,
            item.isactive,
            item.prefix,
            item.lastReadRecommend,
            item.timesOfReading,
            item.children
          );
          // lastReadRecommend is not apart of constructor, so it is set here
          this.parent.lastReadRecommend = item.lastReadRecommend;
          this.parent.timesOfReading = item.timesOfReading;
          return this.parent;
        });
      })
    );
  }

  /*DELETE: delete parent from the database */
  deletePatient(userId: string): Observable<any> {
    return this.http.delete(this.endpoint + "/delete?userId=" + userId, {
      responseType: "text",
    });
  }

  addMultipleParents(parents: FFQParent[]): Observable<FFQParent[]> {
    return this.http.post<FFQParent[]>(
      this.endpoint + "/createManyParents",
      parents,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
    );
  }

  submitRecommend(userId: string, date: string): Observable<any> {
    return this.http.put(this.endpoint + "/updaterecommend", {
      userId,
      lastReadRecommend: date,
    });
  }
}
