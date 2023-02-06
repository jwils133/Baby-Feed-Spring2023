import { Component, OnInit } from '@angular/core';
import { ResultsService } from 'src/app/services/results/results.service';
import { FFQResultsResponse } from 'src/app/models/ffqresultsresponse';
import {Observable} from 'rxjs';
import { Description } from 'src/app/models/ffqfooddescription';
import { FoodDescriptionService } from 'src/app/services/food-description/food-description.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ParentService } from 'src/app/services/parent/parent-service'

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-recommend-parental',
  templateUrl: './recommend-parental.component.html',
  styleUrls: ['./recommend-parental.component.css']
})
export class RecommendParentalComponent implements OnInit {

  showBracketFirst = false;
  showBracketSecond = false;
  showBracketThird = false;
  showNone = true;

  ageMessage = 'Please select infant age.';
  ageRange1 =  'for child 0 to 5.9 months';
  ageRange2 = 'for child 6 to 11.9 months';
  ageRange3 = 'for child 12 to 24 months';

  results: Description[] = [];

  // Used to get current day and time for when submitting
  today: Date;

  // Used to get logged in person's user ID for when submitting
  loggedInUser = this.authenticationService.currentUserValue;
  userId: string;

  constructor(
    public foodDescriptionService: FoodDescriptionService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private parentService: ParentService,
    private successDialog: MatDialog,
    private router: Router,
    private submissionErrorDialog: MatDialog  ) { }

  ngOnInit() {
    this.getAllResults();
  }
  public getAllResults() {
     const list: Observable<Description[]> = this.foodDescriptionService.getAllFoodItems();
     list.subscribe(m => {
       this.results = m;
     });
  }
  public showFirst() {
    this.showBracketFirst = true;
    this.showBracketSecond = false;
    this.showBracketThird = false;
    this.ageMessage = this.ageRange1;
    this.showNone = false;
  }
  public showSecond() {
    this.showBracketFirst = false;
    this.showBracketSecond = true;
    this.showBracketThird = false;
    this.ageMessage = this.ageRange2;
    this.showNone = false;
  }
  public showThird() {
    this.showBracketFirst = false;
    this.showBracketSecond = false;
    this.showBracketThird = true;
    this.ageMessage = this.ageRange3;
    this.showNone = false;
  }

  submitTime() {
    this.userId = this.loggedInUser[0].userId
    this.today = new Date();
    this.parentService.submitRecommend(this.userId, this.today.toLocaleString("en-US")).subscribe(() => {
      // Used to provide feedback when submitting
      const dialogRef = this.successDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = this.translate.instant('Submitted Successfully');
      dialogRef.componentInstance.message = this.translate.instant('Your submission has been recorded');
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['parent/recommend'],);
      });
    }, (error: HttpErrorResponse) => {
      const dialogRef = this.submissionErrorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = this.translate.instant('Submission Error');
      dialogRef.componentInstance.message = error.message;
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['parent/recommend']);
      });
    });

    window.scrollTo(0, 0)
  }
}
