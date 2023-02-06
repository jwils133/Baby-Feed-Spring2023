import {Component, Inject, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NutrientsRecommendationsService} from 'src/app/services/nutrients-recommendations/nutrients-recommendations.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorDialogPopupComponent} from '../error-dialog-popup/error-dialog-popup.component';
import {FFQNutrientsRecommendations, Recommendation} from 'src/app/models/ffqnutrients-recommendations';
import {FoodRecommendationsService} from 'src/app/services/food-recommendation-service/food-recommendations.service';
import {FFQFoodRecommendations} from 'src/app/models/ffqfood-recommendations';
import {TranslateService} from '@ngx-translate/core';
import {HistoryParentalComponent} from 'src/app/pages/history-parental/history-parental.component';

@Component({
  selector: 'app-recommend-modal',
  templateUrl: './food-recommend-modal.component.html',
  styleUrls: ['./food-recommend-modal.component.css']
})
export class FoodRecommendModalComponent {


  @Input() id;

  constructor(
    @Inject(MAT_DIALOG_DATA) public flagData: { breastMilkFlag },
    public foodRecommendationsService: FoodRecommendationsService,
    private modalService: NgbModal,
    private errorDialog: MatDialog,
    private router: Router,
    private translate: TranslateService) {
  }

  recommendedFood: FFQFoodRecommendations[] = [];

  ngOnInit() {
    this.getFoodRecommendations(this.id);
  }

  private getFoodRecommendations(questionnaireId: string) {
    this.foodRecommendationsService.getFoodRecommendationsByQuestionnaireId(questionnaireId).subscribe(
      data => {
        // The 1st version I'm using is to set a map to save key questionnaireId and the value as key/value pair
        // but the data passed by @INJECT method is an object with {{}},
        // so the 'get' method is still working, but there will be es-lint warning
        // if a baby is having both breast milk and formula, then it never little below, because breast milk will be provided enough
        // put all the questionnaireID that has breast milk
        if (Object.values(this.flagData).indexOf(data.questionnaireId) > -1 && data.foodCategoryRecList[0].label === 'Little below') {
          data.foodCategoryRecList[0].label = 'Adequate';
        }
        this.recommendedFood.push(data);
      },
    );
  }

  color(label: string) {
    let colorLabel;
    switch (label.toLowerCase()) {
      case 'below':
        colorLabel = 'yellow';
        break;
      case 'above':
        colorLabel = 'red';
        break;
      case 'little above':
        colorLabel = 'red';
        break;
      default:
        colorLabel = 'green';
        break;
    }
    return colorLabel;
  }
}
