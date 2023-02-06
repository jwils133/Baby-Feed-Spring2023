import { Component, OnInit } from '@angular/core';
import { Description } from 'src/app/models/ffqfooddescription';
import { Observable } from 'rxjs';
import { FoodDescriptionService } from 'src/app/services/food-description/food-description.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { formatDate } from '@angular/common';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { TrackerResultsResponse } from 'src/app/models/trackerresultsresponse';
import { TrackerItems } from 'src/app/models/trackeritems';
import { TrackerResponseService } from 'src/app/services/tracker-response/tracker-response.service';
import { HttpErrorResponse } from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tracker-page',
  templateUrl: './tracker-page.component.html',
  styleUrls: ['./tracker-page.component.css']
})
export class TrackerPageComponent implements OnInit {

  INSTRUCTIONS_TITLE = 'Instructions: \n';
  
  showBracketFirst = false;
  showBracketSecond = false;
  showBracketThird = false;
  showItems = false;
  showAgeForm = true;
  age: number;

  foodResults: Description[];
  trackerForm: FormGroup;
  trackerResponse: TrackerResultsResponse;
  trackerItems: TrackerItems[] = [];

  constructor(public foodDescriptionService: FoodDescriptionService,
              private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private submissionErrorDialog: MatDialog,
              private successDialog: MatDialog,
              private trackerResponseService: TrackerResponseService,
              private translate: TranslateService) {}
              
 toggleLanguage(): void {
    // If page is currently spanish go to english
    if (this.translate.currentLang == 'es') {
      this.translate.use('en-US');
    }
    // Else if page is not spanish go to spanish
    else {
      this.translate.use('es');
    }
  }


  ngOnInit() {
    this.getAllResults();
    // build form
    this.trackerForm = this.formBuilder.group({
      userId: [this.authenticationService.currentUserId],
      responses: this.formBuilder.array([
        this.formBuilder.group({
          answer: [null, [Validators.required]]
        })
      ])
    });
  }

  public submitTracker() {
    // check if complete
    let completed = true;
    for (const response of this.trackerForm.controls.responses.value) {
      if (!response.answer) {
        completed = false;
      }
    }
    // create response object and submit to service
    if (completed) {
      for (let i = 0; i < this.foodResults.length; i++) {
        this.trackerItems.push(new TrackerItems(this.foodResults[i].foodItemGroupName,
                                                this.trackerForm.controls.responses.value[i].answer));
      }
      this.trackerResponse = new TrackerResultsResponse(this.authenticationService.currentUserId,
                                                        this.age,
                                                        formatDate(new Date(), 'MM/dd/yyyy', 'en'),
                                                        this.trackerItems);
      this.trackerResponseService.submitTracker(this.trackerResponse).subscribe(() => {
        const dialogRef = this.successDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = this.translate.instant('Submitted Successfully');
        dialogRef.componentInstance.message = this.translate.instant('Your submission has been recorded');
        // Created this afterClosed code snippet so users can see they are done with the tracking AND THEN redirect them to the proper page
        // This snippet fixes the page bug that doesnt scroll all the way to the top.
        // Created by Alberto Canete and Henry Labrada
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['parent/tracker-history']);
        });
      }, (error: HttpErrorResponse) => {
        const  dialogRef  = this.submissionErrorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = this.translate.instant('Submission Error');
        dialogRef.componentInstance.message = error.message;
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['parent/tracker-history']);
        });
      });

    } else {
      const  dialogRef  = this.submissionErrorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = this.translate.instant('Tracker Incomplete');
      dialogRef.componentInstance.message = this.translate.instant('Please ensure all required fields are completed');
    }
  }
  private getAllResults() {
     const list: Observable<Description[]> = this.foodDescriptionService.getAllFoodItems();
     list.subscribe(m => {
       this.foodResults = m;
       // create room in form for all items
       for (let i = 1; i < this.foodResults.length; i++) {
        this.addResponseRow();
      }
     });
  }

  private addResponseRow() {
    const responsesArray = this.trackerForm.controls.responses as FormArray;
    responsesArray.push(
      this.formBuilder.group({
        answer: [null, [Validators.required]]
      }));
  }

  public enterAge(age: number) {
    if (age) {
      this.showAgeForm = false;
      this.showItems = true;
      this.age = age;

      if (age < 6) {
        this.showBracketFirst = true;
        this.showBracketSecond = false;
        this.showBracketThird = false;
      }
      else if (age >= 6 && age < 12) {
        this.showBracketFirst = false;
        this.showBracketSecond = true;
        this.showBracketThird = false;
      }
      else {
        this.showBracketFirst = false;
        this.showBracketSecond = false;
        this.showBracketThird = true;
      }
    }
  }
}
