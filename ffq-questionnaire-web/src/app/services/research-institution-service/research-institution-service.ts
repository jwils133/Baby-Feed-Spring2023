import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FFQItemResponse } from "../../models/ffqitem-response";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { FFQItemCalcRequest } from "../../models/ffqitem-calc-request";
import { FFQFoodNutrientsResponse } from "src/app/models/ffqfoodnutrients-response";
import { FFQFoodItem } from "src/app/models/ffqfooditem";
import { ɵangular_packages_forms_forms_q } from "@angular/forms";
import {
  Http,
  Headers,
  Response,
  RequestOptions,
  RequestMethod,
} from "@angular/http";
import { FFQFoodItemResponse } from "src/app/models/ffqfooditem-response";
import { FFQAdminResponse } from "src/app/models/ffqadmin-response";
import { FFQResearchInstitution } from "src/app/models/ffq-research-institution";
import { environment } from "src/environments/environment";
//const mongoose = require('mongoose');
//declare var require: any
//Created by Khalid Alamoudi

const httOptions = {
  headers: new HttpHeaders({ "Content-Type": "aplication/json" }),
};

@Injectable({
  providedIn: "root",
})
export class ResearchInstitutionService {
  endpoint = environment.userServiceUrl + "/ffq/research_institution";

  constructor(private http: HttpClient) {}

  addUser(researchInst: FFQResearchInstitution): Observable<any> {
    return this.http
      .post(this.endpoint + "/createInstitution", researchInst, {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
      })
      .pipe(
        tap(
          (data) => console.log(data),
          (error) => console.log(error)
        )
      );
  }

  //Still not implemented
  updateUser(researchInst: FFQResearchInstitution): Observable<any> {
    return this.http
      .put(this.endpoint + "/updateinstitution", researchInst, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })})
  }


  //To be implemented
  getResearchInstitution(researchInstitutionId: string): Observable<FFQResearchInstitution> {
    return this.http.get<FFQResearchInstitution>(this.endpoint + "/" + researchInstitutionId);
  }

  //To be implemented
  getResearchInstitutionByName(institutionName: string): Observable<FFQResearchInstitution> {
    return this.http.get(this.endpoint + "/name/" + institutionName).pipe(
      map((item: any) => {
        return new FFQResearchInstitution(
          item.researchInstitutionId,
          item.address,
          item.createdDate,
          item.institutionName,
          "researchInstitution",
          item.participantsLimit
        );
      })
    );
  }

  getAllResearchInstitutions(): Observable<FFQResearchInstitution[]> {
    // getMongoUsers();
    return this.http.get(this.endpoint + "/all").pipe(
      map((res: any) => {
        return res.map((item) => {
          return new FFQResearchInstitution(
          item.researchInstitutionId,
          item.address,
          item.createdDate,
          item.institutionName,
          item.researchInstitution,
            item.participantsLimit
          );
        });
      })
    );
  }

  deleteItem(researchInstitutionId: string): Observable<any> {
    return this.http.delete(this.endpoint + "/delete?researchInstitutionId=" + researchInstitutionId, {
      responseType: "text",
    });
  }
}

