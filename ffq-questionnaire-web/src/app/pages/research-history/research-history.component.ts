/*

  Added by Ver 2.0 group, edited by Javier Romero to make it look more consistent with the rest of the pages.
  This is the first page of the resarch portal (research/home).
  Here you can see a list of all the food items in the database.
  The admin can create, edit or delete food items in this page.

*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// For getting results
import { ResultsService } from 'src/app/services/results/results.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NutrientsRecommendationsService } from 'src/app/services/nutrients-recommendations/nutrients-recommendations.service';
import { FFQResultsResponse } from 'src/app/models/ffqresultsresponse';
import { ResearcherParentService } from 'src/app/services/researcher-parent/researcher-parent-service';
import { FFQResearcherParentResponse } from 'src/app/models/ffqresearcherparent-response';
import { NutrientConstants } from 'src/app/models/NutrientConstants';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { FoodRecommendationsService } from 'src/app/services/food-recommendation-service/food-recommendations.service';
import { ExportService } from 'src/app/services/export/export-service';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { FFQResearcherParent } from 'src/app/models/ffqresearcherparent';
import { FFQFoodRecommendations } from 'src/app/models/ffqfood-recommendations';
import { element } from 'protractor';
import {FFQParent} from '../../models/ffqparent';
import {FFQParentResponse} from '../../models/ffqparent-response';
import {ParentService} from '../../services/parent/parent-service';
import {take} from 'rxjs/operators';


@Component({
  selector: 'research-history',
  templateUrl: './research-history.component.html',
  styleUrls: ['./research-history.component.css'],
})
export class ResearchHistoryComponent implements OnInit {

  public show = false;
  public buttonName: any = 'Results';
  // researcherId: string = this.authenticationService.currentUserId;
  loggedInUser = this.authenticationService.currentUserValue;
  private ffqparentList: FFQParent[] = [];

  MESSAGE = 'No questionnaires have been submitted yet!';

  results: FFQResultsResponse[] = [];
  participantList: FFQResearcherParent[] = [];
  // Test
  customers: any = [];

  constructor(
    private errorDialog: MatDialog,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private resultsService: ResultsService,
    private foodRecommendationsService: FoodRecommendationsService,
    private nutrientsRecommendationsService: NutrientsRecommendationsService,
    private participantService: ResearcherParentService,
    private exportService: ExportService,
    private parentService: ParentService

  ) {}

  toggle(index) {
    this.results[index].show = !this.results[index].show;
    if (this.results[index].show) { this.buttonName = 'Results'; }
    else { this.buttonName = 'Results'; }
  }

  ngOnInit() {

    this.getParticipantList();
    this.getParentsList();
    this.getParticipantResult();

    // Test
    // for (let i = 0; i <= 25; i++) {
    //   this.customers.push({firstName: `first${i}`, lastName: `last${i}`,
    //   email: `abc${i}@gmail.com`, address: `000${i} street city, ST`, zipcode: `0000${i}`});
    // }

  }

  export() {
    this.exportService.exportFFQResults(this.results, this.ffqparentList, 'FFQ_Results');
  }

  private getParticipantList(){

    let participantListObservable: Observable<FFQResearcherParentResponse[]> = this.participantService.getAllParents();

    participantListObservable.subscribe(participantList => {
      participantList.forEach(participant => {
        if (participant.prefix === this.loggedInUser[0].prefix){
          this.participantList.push(participant);
        }
      });
    });

  }


  private getParticipantResult() {

    const oldList: Observable<FFQResultsResponse[]> = this.resultsService.getResultsByUserType('participant');

    oldList.subscribe(m => {

      this.participantList.forEach(participant => {

        m.forEach(element => {

          if (element.userId === participant.userId){

            this.results.push(element);
          }
        });

      });

      console.log(m);

      this.setNutrients();
      this.setFoodList();
    });

  }

  private setNutrients() {

    const reqList: string[] = NutrientConstants.NUTRIENT_NAMES;
    const oldListObservable: Observable<FFQResultsResponse[]> = of(this.results);


    oldListObservable.subscribe(m => {

      m.forEach(element => {
      const newWeeklyMap = new Map<string, number>();
      const newDailyMap = new Map<string, number>();

      const weeklyMap = element.weeklyTotals;
      const dailyMap = element.dailyAverages;

        reqList.forEach(a => {
          if (typeof weeklyMap[a] == 'number')
          { newWeeklyMap.set(a, weeklyMap[a]); }
          else
          { newWeeklyMap.set(a, 0); }
          if (typeof dailyMap[a] == 'number')
          { newDailyMap.set(a, dailyMap[a]); }
          else
          { newDailyMap.set(a, 0); }
      });

      element.weeklyTotals = newWeeklyMap;
      element.dailyAverages = newDailyMap;
      });

      console.log(m);
      this.results = m.reverse();

     });


  }

  private setFoodList() {

    this.results.forEach(result => {

      let recommendedFood: FFQFoodRecommendations[] = [];

      this.foodRecommendationsService.getFoodRecommendationsByQuestionnaireId(result.questionnaireId).subscribe(
        data => {
          recommendedFood.push(data);
        },
      );

      result.foodRecList = recommendedFood;

    });

  }

  private getParentsList() {
    this.parentService.getAllParents().pipe(
      take(1),
    ).subscribe(a => {
      this.ffqparentList = a;
    });
  }
}
