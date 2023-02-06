import { Component, OnInit } from "@angular/core";
import { QuestionnaireValidatorService } from "../../services/questionnaire-validator/questionnaire-validator.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorDialogPopupComponent } from "../../components/error-dialog-popup/error-dialog-popup.component";
import { FFQItem } from "../../models/ffqitem";
import { FoodItemService } from "../../services/food-item/food-item.service";
import { log } from "util";
import { HttpErrorResponse } from "@angular/common/http";
import { QuestionnaireResponse } from "../../models/questionnaire-response";
import { Questionnaire } from "../../models/Questionnaire";
import { FFQItemCalcRequest } from "../../models/ffqitem-calc-request";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ResultsPageComponent } from "../results-page/results-page.component";
import { FFQResult } from "../../models/FFQResult";
import { NutrientConstants } from "../../models/NutrientConstants";
import { Validators, FormControl } from "@angular/forms";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { MatDialog } from "@angular/material/dialog";
// tslint:disable-next-line:import-spacing
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-questionnaire-page",
  templateUrl: "./questionnaire-page.component.html",
  styleUrls: ["./questionnaire-page.component.css"],
})
export class QuestionnairePageComponent implements OnInit {
  TITLE = "Food Frequency Questionnaire";
  MAIN_MESSAGE =
    "In the last 7 days and nights, how many times did your baby eat or drink the following?\n" +
    "Include those foods and drinks given to the baby by you and others, such as grandparents, babysitters, etc.\n\n";
  INSTRUCTIONS_TITLE = "Instructions: \n";
  BULLETED_INSTRUCTIONS = [
    "For each entry, enter the number of times a food was consumed by your baby and\n" +
      " specify whether this was per week or per day.",
    "If your baby did not eat this food in the last week, hit 'x' for not applicable\"" +
      "All open question blocks must be completely filled out before submitting the questionnaire.",
    "Click the submit button at the bottom of the from when finished.",
  ];

  userId: string;
  id: string;
  userType: string;
  gender: string;
  infantage: number;
  questionnaire: QuestionnaireResponse;
  hideSecondaryItems = false;
  dataLoaded: Promise<boolean>;

  foodItems: FFQItem[] = [];
  tmpfoodItems: FFQItem[] = [];

  submitting = false;

  constructor(
    public foodService: FoodItemService,
    public questService: QuestionnaireValidatorService,
    private activatedRoute: ActivatedRoute,
    private errorDialog: MatDialog,
    private submissionErrorDialog: MatDialog,
    private httpErrorDialog: MatDialog,
    private successDialog: MatDialog,
    private router: Router,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = this.authenticationService.currentUserId;
      this.id = params.get("id");
      this.userType = this.authenticationService.currentUserValue[0].usertype;
    });
    this.loadFoodItems();
  }

  submitQuestionnaire() {
    this.submitting = true;

    let pageHasErrors = false;
    for (const foodItem of this.foodItems) {
      if (this.hideSecondaryItems && !foodItem.isPrimary) {
        foodItem.disabled = true;
      }
      if (!foodItem.disabled) {
        foodItem.isSubmitted = true;
        if (foodItem.getErrorState().length > 0) {
          pageHasErrors = true;
        }
      }
    }

    if (pageHasErrors) {
      log("Errors on page. Questionnaire incomplete.");
      const dialogRef = this.submissionErrorDialog.open(
        ErrorDialogPopupComponent
      );
      dialogRef.componentInstance.title = "Questionnaire Incomplete";
      dialogRef.componentInstance.message =
        "Please ensure all required fields are completed.";
      this.submitting = false;
    } else {
      log("Questionnaire submitted successfully.");
      const itemList: FFQItemCalcRequest[] = [];
      for (const fooditem of this.foodItems) {
        if (!fooditem.disabled) {
          const request = FFQItemCalcRequest.calcRequestFromFoodItem(fooditem);
          console.log(request.toString());
          itemList.push(request);
        }
      }

      this.foodService
        .calculateNutrientBreakdown(
          this.userId,
          this.userType,
          this.id,
          this.infantage,
          this.gender,
          itemList
        )
        .subscribe(
          (results) => {
            console.log(results);
            const dailyMap: Map<string, number> = new Map();
            const weeklyMap: Map<string, number> = new Map();
            for (const nutrient of NutrientConstants.NUTRIENT_NAMES) {
              const dailyValue = results.dailyAverages[nutrient];
              const weeklyValue = results.weeklyTotals[nutrient];
              if (
                dailyValue !== null &&
                dailyValue !== undefined &&
                weeklyValue !== null &&
                weeklyValue !== undefined
              ) {
                console.log(
                  "Nutrient: " + nutrient + ", Daily Value: " + dailyValue
                );
                dailyMap.set(nutrient, dailyValue);
                console.log(
                  "Nutrient: " + nutrient + ", Weekly Value: " + weeklyValue
                );
                weeklyMap.set(nutrient, weeklyValue);
              }
              console.log(this.infantage);
            }
            const ffqResult = new FFQResult(dailyMap, weeklyMap);
            /*
            const modalRef = this.modalService.open(ResultsPageComponent);
            modalRef.componentInstance.results = ffqResult;
            console.log('OPENED MODAL');
            */

            this.questService.submitQuestionnaire(this.id).subscribe(
              (data: Questionnaire) => {
                this.router.navigateByUrl("/");
                const dialogRef = this.successDialog.open(
                  ErrorDialogPopupComponent
                );
                dialogRef.componentInstance.title =
                  "Questionnaire submitted successfully.";
                dialogRef.componentInstance.message =
                  "The questionnaire has been sent to the issuer.";
                this.submitting = false;
              },
              (error: HttpErrorResponse) => this.handleSubmissionError(error)
            );
          },
          (error: HttpErrorResponse) => this.handleSubmissionError(error)
        );
    }
  }

  public toggleHideSecondaryItems() {
    this.hideSecondaryItems = !this.hideSecondaryItems;
  }

  // private loadFoodItems() {
  //   this.foodService.getFoodItems().subscribe(data => {
  //     data.map(response => {
  //       this.foodItems.push(FFQItem.foodItemFromResponse(response));
  //     });
  //     console.log(this.foodItems.length + ' food items returned from server.');
  //     this.dataLoaded = Promise.resolve(true);
  //   }, (error: HttpErrorResponse) => this.handleFoodServiceError(error));
  // }

  private loadFoodItems() {
    this.foodService.getFoodItems().subscribe(
      (data) => {
        data.map((response) => {
          this.tmpfoodItems.push(FFQItem.foodItemFromResponse(response));
          // console.log(FFQItem.foodItemFromResponse(response).name);
        });

        this.foodItems = this.getFoodItemByPosition(this.tmpfoodItems);

        console.log(
          this.tmpfoodItems.length + "tmp food items returned from server."
        );
        console.log(
          this.foodItems.length + " food items returned from server."
        );

        this.dataLoaded = Promise.resolve(true);
      },
      (error: HttpErrorResponse) => this.handleFoodServiceError(error)
    );
  }

  // returns a FFQ item with the itemPosition equal to the position param
  private getFoodItemByPosition(arr: FFQItem[]): FFQItem[] {
    var sortedArray = arr.sort(function (a, b) {
      return a.itemPosition > b.itemPosition
        ? 1
        : a.itemPosition < b.itemPosition
        ? -1
        : 0;
    });
    return sortedArray;
  }

  private handleFoodServiceError(error: HttpErrorResponse) {
    console.error("Error occurred.\n" + error.message);
    const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
    dialogRef.componentInstance.title = "Error Fetching Food Items";
    dialogRef.componentInstance.message = error.message;
    dialogRef.componentInstance.router = this.router;
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl("/");
    });
  }

  private handleQuestionnaireError(error: Error) {
    this.router.navigateByUrl("/");
    console.error("Error occurred: " + error.message);
    const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
    dialogRef.componentInstance.title = "Error Validating Id";
    dialogRef.componentInstance.message = error.message;
  }

  private handleSubmissionError(error: Error) {
    this.router.navigateByUrl("/");
    console.error("Error occurred: " + error.message);
    const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
    dialogRef.componentInstance.title = "Error Submitting Questionnaire";
    dialogRef.componentInstance.message =
      error.message + ". Try again or contact administrator.";
    this.submitting = false;
  }
}
