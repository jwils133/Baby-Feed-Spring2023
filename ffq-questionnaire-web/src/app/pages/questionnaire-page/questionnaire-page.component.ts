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
import { isInteger } from "@ng-bootstrap/ng-bootstrap/util/util";
import { TranslateService } from "@ngx-translate/core";
import { FeedingFrequencyComponent } from "src/app/components/feeding-frequency/feeding-frequency.component";

@Component({
  selector: "app-questionnaire-page",
  templateUrl: "./questionnaire-page.component.html",
  styleUrls: ["./questionnaire-page.component.css"],
})
export class QuestionnairePageComponent implements OnInit {
  TITLE = "Food Frequency Questionnaire";
  MAIN_MESSAGE =
    "Below is a list of foods and drinks to help us learn what your baby is eating and drinking. We want to know: How many times did your baby eat or drink of the following in the last 7 days?";
  INSTRUCTIONS_TITLE = "How to fill out this questionnaire?: \n";
  BULLETED_INSTRUCTIONS = [
    this.translate.instant(
      "There will be foods and drinks that your baby does not eat or drink. If so, please click on “My baby does not eat/drink” so that you can skip to the next food."
    ),
    this.translate.instant(
      "For each food and drink, you can click the up or down arrows for the number of times a food and drink were consumed, the serving size, and if it was given weekly or daily."
    ),
    this.translate.instant(
      "You can click on the pictures to the right of each item to help you with the serving size and can also see the pictures larger."
    ),
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
  patientName: string;

  // Used to display and hide error messages
  decimalError = false;
  genderError = false;
  ageRequiredError = false;

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
    private translate: TranslateService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.userId = this.authenticationService.currentUserId;
      this.id = params.get("id");
      this.patientName = JSON.parse(
        localStorage.getItem("currentUser")
      )[0].username;

      // use the usertype to determine what collection to store the questionnaire
      this.userType = this.authenticationService.currentUserValue[0].usertype;
    });
    this.loadFoodItems();
  }

  openDialog(): void {
    this.dialog.open(FeedingFrequencyComponent);
  }

  submitQuestionnaire() {
    this.submitting = true;

    // Reset error messages
    this.genderError = false;
    this.decimalError = false;
    this.ageRequiredError = false;

    let pageHasErrors = false;

    // If there is no gender, display error
    if (!this.gender) {
      pageHasErrors = true;
      this.genderError = true;
    }

    // Typecheck to only receive Integers. Without this we get a submit error and exits the page.
    if (this.infantage % 1 != 0) {
      pageHasErrors = true;
      // If age is not a whole number, display error
      this.decimalError = true;
    }

    if (this.infantage < 0) {
      pageHasErrors = true;
    }

    // If age is left blank display only required error
    if (this.infantage == null) {
      pageHasErrors = true;
      this.ageRequiredError = true;
      this.decimalError = false;
    }

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
      dialogRef.componentInstance.title = this.translate.instant(
        "Questionnaire Incomplete"
      );
      dialogRef.componentInstance.message = this.translate.instant(
        "Please ensure all required fields are completed"
      );
      this.submitting = false;
    } else {
      // here is where the questionnaire is submitted**

      log("Questionnaire submitted successfully.");
      const itemList: FFQItemCalcRequest[] = [];
      for (const fooditem of this.foodItems) {
        if (!fooditem.disabled) {
          const request = FFQItemCalcRequest.calcRequestFromFoodItem(fooditem);
          itemList.push(request);
        }
      }

      this.foodService
        .calculateNutrientBreakdown(
          this.userId,
          this.id,
          this.userType,
          this.infantage,
          this.gender,
          this.patientName,
          itemList
        )
        .subscribe(
          (results) => {
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
                dailyMap.set(nutrient, dailyValue);
                weeklyMap.set(nutrient, weeklyValue);
              }
            }

            this.questService.submitQuestionnaire(this.id).subscribe(
              (data: Questionnaire) => {
                const dialogRef = this.successDialog.open(
                  ErrorDialogPopupComponent
                );
                dialogRef.componentInstance.title = this.translate.instant(
                  "Submitted Successfully"
                );
                dialogRef.componentInstance.message = this.translate.instant(
                  "The questionnaire has been sent to the issuer"
                );
                dialogRef
                  .afterClosed()
                  .subscribe(() => this.router.navigateByUrl("/"));
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

  private loadFoodItems() {
    this.foodService.getFoodItems().subscribe(
      (data) => {
        data.map((response) => {
          this.tmpfoodItems.push(FFQItem.foodItemFromResponse(response));
        });

        this.foodItems = this.getFoodItemByPosition(this.tmpfoodItems);

        this.dataLoaded = Promise.resolve(true);
      },
      (error: HttpErrorResponse) => this.handleFoodServiceError(error)
    );
  }

  // returns a FFQ item with the itemPosition equal to the position param
  private getFoodItemByPosition(arr: FFQItem[]): FFQItem[] {
    const sortedArray = arr.sort(function (a, b) {
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
    dialogRef.componentInstance.title = this.translate.instant(
      "Error Fetching Food Items"
    );
    dialogRef.componentInstance.message = error.message;
    dialogRef.componentInstance.router = this.router;
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl("/");
    });
  }

  private handleQuestionnaireError(error: Error) {
    //this.router.navigateByUrl('/');
    console.error("Error occurred: " + error.message);
    const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
    dialogRef.componentInstance.title = this.translate.instant(
      "Error Validating Id"
    );
    dialogRef.componentInstance.message = error.message;
  }

  private handleSubmissionError(error: Error) {
    //this.router.navigateByUrl('/');
    console.error("Error occurred: " + error.message);
    const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
    dialogRef.componentInstance.title = this.translate.instant(
      "Error Submitting Questionnaire"
    );
    dialogRef.componentInstance.message =
      error.message + ". Try again or contact administrator.";
    this.submitting = false;
  }
}
