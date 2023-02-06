  import {Component, OnInit} from '@angular/core';
  import {ActivatedRoute, Router} from '@angular/router';
  import {ErrorDialogPopupComponent} from '../../components/error-dialog-popup/error-dialog-popup.component';
  import {log} from 'util';
  import {HttpErrorResponse} from '@angular/common/http';
  import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
  import { Observable } from 'rxjs';
  import { ResearchService } from 'src/app/services/research/research-service';
  import {ResearchInstitutionService} from "src/app/services/research-institution-service/research-institution-service"
  import {FFQInstitutionResponse} from "src/app/models/ffqinstitution-response";
  import { FfqParticipant  } from 'src/app/models/ffq-participant';
  import { ResearcherParticipantService } from 'src/app/services/research-participant/research-participant-service';
  import {FFQResearcher} from 'src/app/models/ffqresearcher';
  import { FFQInstitution } from 'src/app/models/ffqinstitution';
  import { User } from 'src/app/models/user';
  import { Validators, FormControl } from '@angular/forms';
  import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
  import {MatDialog} from "@angular/material/dialog";
  
  @Component({
    selector: "app-questionnaire-page",
    templateUrl: "./research-page.component.html",
    styleUrls: ["./research-page.component.css"],
  })

  export class ResearchPageComponent implements OnInit {
    public showResearchers: boolean;
    public showParticipants: boolean;
    public showInstitution: boolean;
    private hideUnassignedParticipants: boolean;
    private hideUnassignedResearchers: boolean;
    p_search: string;
    c_search: string;
    loggedInUser = this.authenticationService.currentUserValue;
  
    constructor(
      public researchService: ResearchService,
      public participantService: ResearcherParticipantService,
      public instituteService: ResearchInstitutionService,
      public authenticationService: AuthenticationService,
      private errorDialog: MatDialog,
      private router: Router,
      private route: ActivatedRoute,
      ) {
        this.authenticationService = authenticationService;
       }

    
    ffqresearcherList: FFQResearcher[] = [];
    ffqparticipantList: FfqParticipant[] = [];
    ffqinstituteList: FFQInstitution[] = [];
    instituteNames: string[] = [];
    researcherNames: string[] = [];
    researcherUserNames: string[] = [];
    numberOfParticipants: number[] = [];
    public filtered_researcher: String[] = [];
    public filtered: boolean;
    private instituteId: string;
    private researcherList: FFQResearcher[] = [];
    private participantList: FfqParticipant[] = [];
    private instituteList: FFQInstitution[] = [];
    public currentInstituteName: string;
    public UserList: User[];
    public count: 0;
  
    ngOnInit() {
  
      this.showResearchers = true;
      this.showInstitution = true;
      this.showParticipants = true;
      this.hideUnassignedParticipants = false;
      this.hideUnassignedResearchers = false;
      this.researcherNames.push('');
      this.researcherUserNames.push('');
      this.getInstituteId();
    }
  
    toggleResearchers($event)
    {
      this.showResearchers = !this.showResearchers;
    }
  
    toggleInstitutions($event)
    {
      this.showInstitution = !this.showInstitution;
    }
  
    toggleParticipants($event)
    {
      this.showParticipants = !this.showParticipants;
    }
  
    toggleUnassignedParticipants($event)
    {
      this.hideUnassignedParticipants = !this.hideUnassignedParticipants;
    }
  
    toggleUnassignedResearchers($event)
    {
      this.hideUnassignedResearchers = !this.hideUnassignedResearchers;
    }
  
    filterByResearcher(researcher_name: string)
    {
      const index = this.filtered_researcher.indexOf(researcher_name);
      if (index === -1)
      {
        this.filtered_researcher.push(researcher_name);
      }
      else
      {
        this.filtered_researcher.splice(index, 1);
      }
      if (this.filtered_researcher.length == 0)
      {
        this.filtered = false;
      }
      else
      {
        this.filtered = true;
      }
    }
  
    private getInstituteId(){
  
      const instituteListObervable: Observable<FFQInstitutionResponse[]> = this.instituteService.getAllResearchInstitutions();
  
      instituteListObervable.subscribe(instituteList => {
        const institution = instituteList.find(a => a.researchInstitutionId == this.loggedInUser[0].assignedinstitution);
        if (institution){
          this.instituteId = institution.researchInstitutionId;
          this.currentInstituteName = institution.institutionName;
        }
        this.getParticipants();
      });
  
    }
  
      // loadData function serves to store the result and parent names into the FFQParentResult object
      //                  serves to display the questionnaire-result data using the specification based on PO's list
    loadData(){
      const reseracherListObservable: Observable<FFQResearcher[]> = this.researchService.getAllUsers();
  
      reseracherListObservable.subscribe(researcherList => {
          researcherList.forEach(researcher => {
            if (researcher.assignedResearchInstitutionId === this.instituteId){
              this.researcherList.push(researcher);
            }
          });
          this.getNumberOfParticipants();
          this.getResearcherNames();
          this.getInstitutes();
        });
    }
  
    //Not getting participant names
    getParticipants(){
      const participantListObservable: Observable<FfqParticipant[]> = this.participantService.getAllResearchParticipants();
  
      participantListObservable.subscribe(participantList => {
        participantList.forEach(participant => {
          if (participant.assignedResearcherInst === this.instituteId && participant.prefix === this.loggedInUser[0].prefix){
            this.participantList.push(participant);
          }
        });
        this.loadData();
      });
    }
  
    //Not getting participant count
    getNumberOfParticipants(){
      this.count = 0;
      this.researcherList.forEach(researcher => {
        this.participantList.forEach(participant => {
          for (let i = 0; i < participant.assignedResearcherUsers.length; i++) {
            if (participant.assignedResearcherUsers[i] === researcher.userId && researcher.userId === this.loggedInUser[0].userId ){
              this.count++;
            }
          }
        });
        this.numberOfParticipants.push(this.count);
        });
    }
  
    getResearcherNames(){
      const researcherList: Observable<FFQResearcher[]> = this.researchService.getAllUsers();
      researcherList.subscribe(a => {
        this.ffqresearcherList = a;
        for (let i = 0; i < a.length; i++) {
          this.researcherNames.push(a[i].firstname + ' ' + a[i].lastname);
          this.researcherUserNames.push(a[i].username);
        }
      });
    }
  
    private getInstitutes(){
  
      const instituteListObervable: Observable<FFQInstitutionResponse[]> = this.instituteService.getAllResearchInstitutions();
      const loggedInUser = this.authenticationService.currentUserValue;
  
      let instituteId: string;
  
      instituteListObervable.subscribe(instituteList => {
        instituteList.forEach(institute => {
          if (institute.researchInstitutionId === this.instituteId) {
            this.instituteList.push(institute);
          }
  
        });
  
      });
  
    }  }
  
  
