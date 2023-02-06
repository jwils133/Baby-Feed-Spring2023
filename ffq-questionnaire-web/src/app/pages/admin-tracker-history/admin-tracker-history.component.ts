import { Component, OnInit } from '@angular/core';
import { TrackerResultsResponse } from 'src/app/models/trackerresultsresponse';
import { TrackerResultsService } from 'src/app/services/tracker-results/tracker-results.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Observable } from 'rxjs';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { ParentService } from 'src/app/services/parent/parent-service';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { ClinicService } from 'src/app/services/clinic/clinic-service';
import { ExportService } from '../../services/export/export-service';

@Component({
  templateUrl: './admin-tracker-history.component.html',
  styleUrls: ['./admin-tracker-history.component.css']
})
export class AdminTrackerHistoryComponent implements OnInit {

  results: TrackerResultsResponse[] = [];
  private parentIds: string[] = [];
  private clinicId: string;
  allParents: string[] = [];

  constructor(private trackerResultsService: TrackerResultsService,
              private authenticationService: AuthenticationService,
              public parentService: ParentService,
              public clinicService: ClinicService,
              public exportService: ExportService,
              ) { }

  ngOnInit() {
    this.allParents.push("");
    this.getClinicId();
    this.getParents();
    this.getAllResults();
  }

  private getAllResults() {
    this.trackerResultsService.getAllResults().subscribe(results => {
      results.forEach(result => {
            this.results.push(result);
        })
      this.results = this.results.reverse();
    });
  };

  private getClinicId(){

    var clinicListObervable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    const loggedInUser = this.authenticationService.currentUserValue;
    var clinicId: string;

    clinicListObervable.subscribe(clinicList => {
      var clinic = clinicList.find(a => a.clinicId == loggedInUser[0].assignedclinic);
      if(clinic){
        this.clinicId = clinic.clinicId;
      }
    });

  }

  getParents()
  {
    var parentListObservable: Observable<FFQParentResponse[]> = this.parentService.getAllParents();

    parentListObservable.subscribe(parentList => {
      parentList.forEach(parent => {
        this.allParents.push(parent.username);
        this.parentIds.push(parent.userId);
      });
    });
  }

  export() {
    this.exportService.exportTrackingHistory(this.results, this.allParents, 'TrackingHistory');
  }

}
