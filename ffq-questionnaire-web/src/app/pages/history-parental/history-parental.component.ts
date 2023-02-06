import {Component, OnInit} from '@angular/core';
import {FFQResultsResponse} from 'src/app/models/ffqresultsresponse';
import {Observable} from 'rxjs';
import {ResultsService} from 'src/app/services/results/results.service';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {NutrientConstants} from 'src/app/models/NutrientConstants';
///

/////////// added imports from recommend.component.ts/////////////////////
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RecommendModalComponent} from 'src/app/components/recommend-modal/recommend-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {NutrientsRecommendationsService} from 'src/app/services/nutrients-recommendations/nutrients-recommendations.service';
import {FFQNutrientsRecommendations} from 'src/app/models/ffqnutrients-recommendations';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {Router} from '@angular/router';
import {FoodRecommendModalComponent} from 'src/app/components/food-recommend-modal/food-recommend-modal.component';
import {FoodRecommendationsService} from 'src/app/services/food-recommendation-service/food-recommendations.service';
import {FoodDescriptionService} from 'src/app/services/food-description/food-description.service';

@Component({
  selector: 'app-history-parental',
  templateUrl: './history-parental.component.html',
  styleUrls: ['./history-parental.component.css']
})

export class HistoryParentalComponent implements OnInit {
  public show = false;
  public showFeedback = false;
  breastMilkFlag = [];
  public buttonName: any = 'Results';


  MESSAGE = 'No questionnaires have been submitted yet!';

  results: FFQResultsResponse[] = [];

  constructor(
    public resultsService: ResultsService,
    private authenticationService: AuthenticationService,
    /////
    public nutrientsRecommendationsService: NutrientsRecommendationsService,
    public foodRecommendationsService: FoodRecommendationsService,
    public foodDescriptionService: FoodDescriptionService,
    private modalService: NgbModal,
    private errorDialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getResultsByUser(this.authenticationService.currentUserId);
  }

  toggle(index) {
    this.results[index].show = !this.results[index].show;

    if (this.results[index].show) {
      this.buttonName = 'Results';
    } else {
      this.buttonName = 'Results';
    }

  }

  toggleFeedback(index) {
    this.results[index].showFeedback = !this.results[index].showFeedback;
  }

  private getResultsByUser(userId: string) {
    const oldList: Observable<FFQResultsResponse[]> = this.resultsService.getResultsByUser(
      userId
    );
    const reqList: string[] = NutrientConstants.NUTRIENT_NAMES;

    oldList.subscribe(m => {
      m.forEach(element => {
        const newWeeklyMap = new Map<string, number>();
        const newDailyMap = new Map<string, number>();
        const weeklyMap = element.weeklyTotals;
        const dailyMap = element.dailyAverages;

        reqList.forEach(a => {
          newWeeklyMap.set(a, weeklyMap[a]);
          newDailyMap.set(a, dailyMap[a]);
        });

        element.weeklyTotals = newWeeklyMap;
        element.dailyAverages = newDailyMap;
      });
      this.results = m.reverse();
      this.results = this.results.filter(t => t.userType === 'parent');
      // set breastMilkFlag for food-recommend-model
      // if there is breast milk for the baby, then set flag to true
      this.results.forEach(item => {
        if (item.userChoices[0].name === 'Breast milk') {
          this.breastMilkFlag.push(item.questionnaireId);
        }
      });
    });
  }

  returnZero() {
    return 0;
  }

  /////////////////////////////////////////////////////////////////////////////////
  // (Francis) attempting to add Nutrients and Food Items buttons from recommend tab
  //            copy/pasted from recommend.component.ts
  /////////////////////////////////////////////////////////////////////////////////

  private getNutrientsRecommendations(questionnaireId: string) {
    this.nutrientsRecommendationsService
      .getNutrientsRecommendationsByQuestionnaireId(questionnaireId)
      .subscribe(
        data => {
          this.onModalRequest(questionnaireId);
        },
        error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
          dialogRef.componentInstance.router = this.router;
        }
      );
  }

  private getFoodRecommendations(questionnaireId: string) {
    this.foodRecommendationsService
      .getFoodRecommendationsByQuestionnaireId(questionnaireId)
      .subscribe(
        data => {
          this.onModalRequestFood(questionnaireId);
        },
        error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
          dialogRef.componentInstance.router = this.router;
        }
      );
  }

  getUserName() {
    // <BF-S2021-74>add column with date and username in parent portal
    const local = localStorage.getItem('currentUser');
    const formatLocal = JSON.parse(local);
    const userName = formatLocal[0].username;
    return userName;
  }

  onModalRequest(id: string): void {
    const modalRef = this.errorDialog.open(RecommendModalComponent);
    modalRef.componentInstance.id = id;
  }

  onModalRequestFood(id: string): void {
    const modalRef = this.errorDialog.open(FoodRecommendModalComponent, {
      // the FoodRecommendModalComponent is independent component, in order to access the data which I can only get in current component,
      // pass the data by this method
     data: this.breastMilkFlag
    });
    modalRef.componentInstance.id = id;
  }
}
