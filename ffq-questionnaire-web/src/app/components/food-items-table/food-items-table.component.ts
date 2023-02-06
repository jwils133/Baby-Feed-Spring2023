import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NutrientsRecommendationsService } from 'src/app/services/nutrients-recommendations/nutrients-recommendations.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogPopupComponent } from '../error-dialog-popup/error-dialog-popup.component';
import { FFQNutrientsRecommendations, Recommendation } from 'src/app/models/ffqnutrients-recommendations';
import { FoodRecommendationsService } from 'src/app/services/food-recommendation-service/food-recommendations.service';
import { FFQFoodRecommendations } from 'src/app/models/ffqfood-recommendations';

@Component({
  selector: 'food-items-modal',
  templateUrl: './food-items-table.component.html',
  styleUrls: ['./food-items-table.component.css']
})
export class FoodItemsTableComponent {

  @Input() id;

  constructor(
    public foodRecommendationsService: FoodRecommendationsService,
    private modalService: NgbModal,
    private errorDialog: MatDialog,
    private router: Router, ) { }

  recommendedFood: FFQFoodRecommendations[] = [];

  ngOnInit() {
    this.getFoodRecommendations(this.id);
  }

  private getFoodRecommendations(questionnaireId: string) {
    this.foodRecommendationsService.getFoodRecommendationsByQuestionnaireId(questionnaireId).subscribe(
      data => {
        this.recommendedFood.push(data);
      },
    );
  }
}
