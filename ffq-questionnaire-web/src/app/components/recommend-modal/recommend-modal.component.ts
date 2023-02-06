import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NutrientsRecommendationsService } from "src/app/services/nutrients-recommendations/nutrients-recommendations.service";
import { MatDialog } from "@angular/material/dialog";
import {
  FFQNutrientsRecommendations,
} from "src/app/models/ffqnutrients-recommendations";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: "app-recommend-modal",
  templateUrl: "./recommend-modal.component.html",
  styleUrls: ["./recommend-modal.component.css"],
})
export class RecommendModalComponent {
  @Input() id;

  constructor(
    public nutrientsRecommendationsService: NutrientsRecommendationsService,
    private modalService: NgbModal,
    private errorDialog: MatDialog,
    private router: Router
  ) {}

  recommendedNutrients: FFQNutrientsRecommendations[] = [];

  ngOnInit() {
    this.getNutrientsRecommendations(this.id);
  }

  private getNutrientsRecommendations(questionnaireId: string) {
    this.nutrientsRecommendationsService
      .getNutrientsRecommendationsByQuestionnaireId(questionnaireId)
      .subscribe((data) => {
        this.recommendedNutrients.push(data);
      });
  }

  color(a: string) {
    const b = a.split(" ", 1);
    if (b[0] === "Below") {
      return 'below';
    } else if (b[0] === "Above") {
      return 'above';
    } else if (b[0] === "Adequate") {
      return 'adequate';
    }else if (b[0] === "Little" && b[1] === "below")
    {
      return 'littlebelow';
    }
  }
}
