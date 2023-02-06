/*

  Added by Javier Romero, edited by Khalid Alamoudi
  This is the tracker history page for the clinic portal (clinic/tracker-history).
  From here, the clinician can see all the tracking histories for all parents in the clinic.

*/

import {Component, OnInit} from '@angular/core';
import {TrackerResultsResponse} from 'src/app/models/trackerresultsresponse';
import {TrackerResultsService} from 'src/app/services/tracker-results/tracker-results.service';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Observable, of} from 'rxjs';
import {FFQParentResponse} from 'src/app/models/ffqparent-response';
import {ParentService} from 'src/app/services/parent/parent-service';
import {FFQClinicResponse} from 'src/app/models/ffqclinic-response';
import {ClinicService} from 'src/app/services/clinic/clinic-service';
import {TrackerParentResultsResponse} from 'src/app/models/ffqparentresulttracker';
import { ExportService } from '../../services/export/export-service';

@Component({
  templateUrl: './clinic-tracker-history.component.html',
  styleUrls: ['./clinic-tracker-history.component.css']
})
export class ClinicTrackerHistoryComponent implements OnInit {

  results: TrackerResultsResponse[] = [];
  private parentIds: string[] = [];
  private clinicId: string;
  parentNames: string[] = [];
  parentList: FFQParentResponse[] = [];
  trackerList: TrackerResultsResponse[] = [];
  resultMap: Map<string, TrackerParentResultsResponse> = new Map<string, TrackerParentResultsResponse>();
  resultInfo: TrackerParentResultsResponse[] = [];
  search: string;
  loggedInUser = this.authenticationService.currentUserValue;

  constructor(private trackerResultsService: TrackerResultsService,
              private authenticationService: AuthenticationService,
              public parentService: ParentService,
              public clinicService: ClinicService,
              public exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.getClinicId();
  }


  //loadData function serves to store the tracker history and parent names into the FFQTrackerParentResultsResponse object
  //                  serves to display the tracker history
  private loadData() {

    const trackerObservable: Observable<TrackerResultsResponse[]> = of(this.trackerList);

    trackerObservable.subscribe(tracker => {
      this.trackerList = this.trackerList.reverse();
      this.parentNames = this.parentNames.reverse();

      for (var i = 0; i < this.trackerList.length; i++) {
        var object: TrackerParentResultsResponse = new TrackerParentResultsResponse(
          this.trackerList[i],
          this.parentNames[i]
        );

        this.resultInfo.push(object);
        this.resultMap.set(this.trackerList[i].userId, object);
      }
    });

  };


  //Function to get all the results for each parent
  private getAllResults() {

    const allTrackersObservable = this.trackerResultsService.getAllResults();
    allTrackersObservable.subscribe(allTrackers => {
      this.parentList.forEach(parent => {
        allTrackers.forEach(tracker => {
          if (tracker.userId == parent.userId) {
            this.trackerList.push(tracker);
            var parentName = parent.username;
            this.parentNames.push(parentName);
          }
        });
      });
      this.loadData();
    });

  }

  //Function used to obtain the clinicId for the currently logged in clinician,
  // in order to later display results based only for this specific clinic
  private getClinicId() {

    var clinicListObervable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    var clinicId: string;

    clinicListObervable.subscribe(clinicList => {
      var clinic = clinicList.find(a => a.clinicId === this.loggedInUser[0].assignedclinic);
      if (clinic) {
        this.clinicId = clinic.clinicId;
      }
      this.getParents();
    });

  }

  //Function used to filter the parent list to hold only the parents that are assigned to that specific clinic
  getParents() {
    var parentListObservable: Observable<FFQParentResponse[]> = this.parentService.getAllParents();

    parentListObservable.subscribe(parentList => {
      parentList.forEach(parent => {
        if (parent.prefix === this.loggedInUser[0].prefix) {

          this.parentList.push(parent);
        }
      });
      this.getAllResults();
    });
  }

  export() {
    this.exportService.exportClinicTrackingHistory(this.trackerList, this.parentNames, 'TrackingHistory');
  }
}
