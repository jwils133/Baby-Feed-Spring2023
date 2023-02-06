import { Component, OnInit } from '@angular/core';
import { TrackerResultsResponse } from 'src/app/models/trackerresultsresponse';
import { TrackerResultsService } from 'src/app/services/tracker-results/tracker-results.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { TrackerItems } from 'src/app/models/trackeritems';

import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TrackerResponseService } from 'src/app/services/tracker-response/tracker-response.service';

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tracker-history-page',
  templateUrl: './tracker-history-page.component.html',
  styleUrls: ['./tracker-history-page.component.css']
})
export class TrackerHistoryPageComponent implements OnInit {

  results: TrackerResultsResponse[] = [];
  goal: string;
  _id: string;
  trackerForm: FormGroup;

  
  constructor(private formBuilder: FormBuilder,
              private trackerResultsService: TrackerResultsService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private submissionErrorDialog: MatDialog,
              private successDialog: MatDialog,
              private trackerResponseService: TrackerResponseService,
              private translate: TranslateService  ) { }

  ngOnInit() {
    this.getResultsByUser(this.authenticationService.currentUserId);

    this.trackerForm = this.formBuilder.group({
      userId: [this.authenticationService.currentUserId],
      goal: ['', Validators.required],
      _id: ['', Validators.required]
    });
    // test items
    // for(let i = 0; i < 10; i++) {
    //   this.results[i] = new TrackerResultsResponse("1", i, "4/"+i+"/20", [new TrackerItems("food1", "Above"),
    //                                                                       new TrackerItems("food2", "Equal"),
    //                                                                       new TrackerItems("food3", "Below")]);
    // }
  }

  private getResultsByUser(userId: string) {
    this.trackerResultsService.getResultsByUser(userId).subscribe(res => {
      this.results = res.reverse();
    });
  };

  public test(result: any) {
    console.log(result);
  }

  /* Function used when setting "Goal for next week"
    Takes in the tracker result's ID to know which one to specifically update
    And reads the goal using trackerForm
  */
  public submitGoal(_id: string) {
    this.goal = this.trackerForm.controls.goal.value;
    this.trackerResponseService.submitGoal(_id, this.goal).subscribe(() => {
      // Used to provide feedback when submitting
      const dialogRef = this.successDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = this.translate.instant('Submitted Successfully');
      dialogRef.componentInstance.message = this.translate.instant('Your submission has been recorded');
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['parent/tracker-history']);
      });
    }, (error: HttpErrorResponse) => {
      const dialogRef = this.submissionErrorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = this.translate.instant('Submission Error');
      dialogRef.componentInstance.message = error.message;
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['parent/tracker-history']);
      });
    });
  }
}
