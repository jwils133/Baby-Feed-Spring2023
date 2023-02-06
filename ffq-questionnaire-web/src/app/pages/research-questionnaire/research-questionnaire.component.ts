  import {Component, OnInit} from '@angular/core';
  import { QuestionnaireValidatorService } from '../../services/questionnaire-validator/questionnaire-validator.service';
  import {ActivatedRoute, Router} from '@angular/router';
  import {ErrorDialogPopupComponent} from '../../components/error-dialog-popup/error-dialog-popup.component';
  import {FFQItem} from '../../models/ffqitem';
  import {FoodItemService} from '../../services/food-item/food-item.service';
  import {log} from 'util';
  import {HttpErrorResponse} from '@angular/common/http';
  import {QuestionnaireResponse} from '../../models/questionnaire-response';
  import {Questionnaire} from '../../models/Questionnaire';
  import {FFQItemCalcRequest} from '../../models/ffqitem-calc-request';
  import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
  import {ResultsPageComponent} from '../results-page/results-page.component';
  import {FFQResult} from '../../models/FFQResult';
  import {NutrientConstants} from '../../models/NutrientConstants';
  import { Validators, FormControl } from '@angular/forms';
  import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
  import {MatDialog} from "@angular/material/dialog";
  
  @Component({
    selector: "app-questionnaire-page",
    templateUrl: "./research-questionnaire.component.html",
    styleUrls: ["./research-questionnaire.component.css"],
  })

  export class ResearchQuestionnaireComponent implements OnInit {
  
    TITLE = 'SAMPLE - Food Frequency Questionnaire';
    MAIN_MESSAGE = 'In the last 7 days and nights, how many times did your baby eat or drink the following?\n' +
      'Include those foods and drinks given to the baby by you and others, such as grandparents, babysitters, etc.\n\n';
    INSTRUCTIONS_TITLE = 'Instructions: \n';
    BULLETED_INSTRUCTIONS = [
      'For each entry, enter the number of times a food was consumed by your baby and\n' +
      ' specify whether this was per week or per day.',
      "If your baby did not eat this food in the last week, hit 'x' for not applicable",
      'All open question blocks must be completely filled out before submitting the questionnaire.',
      'Click the submit button at the bottom of the from when finished.'
    ]; 
   
    hideSecondaryItems = false;
    dataLoaded: Promise<boolean>;
    foodItems: FFQItem[] = [];
    tmpfoodItems: FFQItem[] = [];
  
    constructor(public foodService: FoodItemService,
                public questService: QuestionnaireValidatorService,
                private activatedRoute: ActivatedRoute,
                private errorDialog: MatDialog,
                private submissionErrorDialog: MatDialog,
                private httpErrorDialog: MatDialog,
                private successDialog: MatDialog,
                private router: Router,
                private modalService: NgbModal,
                private authenticationService: AuthenticationService) {}
  
    ngOnInit() {   
      this.loadFoodItems();
    }
  
  
    public toggleHideSecondaryItems() {
        this.hideSecondaryItems = !this.hideSecondaryItems;
    }  
  
  
    private loadFoodItems() {
      this.foodService.getFoodItems().subscribe(data => {
        data.map(response => {
          this.tmpfoodItems.push(FFQItem.foodItemFromResponse(response));
        
        });
  
        this.foodItems = this.getFoodItemByPosition(this.tmpfoodItems);
  
        this.dataLoaded = Promise.resolve(true);
      }, (error: HttpErrorResponse) => this.handleFoodServiceError(error));
    }
  
  // returns a FFQ item with the itemPosition equal to the position param
  private getFoodItemByPosition (arr:FFQItem[] ): FFQItem[]{
    var sortedArray = arr.sort(function(a,b){
      return a.itemPosition >b.itemPosition?1:a.itemPosition <b.itemPosition?-1:0
     })
     return sortedArray;
  }
  
    private handleFoodServiceError(error: HttpErrorResponse) {
      console.error('Error occurred.\n' + error.message);
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = 'Error Fetching Food Items';
      dialogRef.componentInstance.message = error.message;
      dialogRef.componentInstance.router = this.router;
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/');
      });
    }
  
    private handleQuestionnaireError(error: Error) {
      this.router.navigateByUrl('/');
      console.error('Error occurred: ' + error.message);
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = 'Error Validating Id';
      dialogRef.componentInstance.message = error.message;
    }
  
   
  
  }
  
  
