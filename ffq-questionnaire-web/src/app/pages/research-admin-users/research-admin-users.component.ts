
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ResearchService } from "src/app/services/research/research-service";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { FFQResearcher } from "src/app/models/ffqresearcher";
import { FFQResearchInstitution } from "src/app/models/ffq-research-institution";
import { ResearchInstitutionService } from 'src/app/services/research-institution-service/research-institution-service';
import {ParticipantService} from "../../services/participant/participant-service";
import {FfqParticipant} from "../../models/ffq-participant";
import {Usertype} from "../../models/usertype.enum";

@Component({
  templateUrl: "./research-admin-users.component.html",
  styleUrls: ["./research-admin-users.component.css"],
})
export class AdminResearchUsersComponent implements OnInit {
  usertype = Usertype
  private showParticipants: boolean;
  showResearchers: boolean;

  searchResearcher: string;
  searchParticipant: string;
  searchResearchInstitution: string;

  constructor(
    public authenticationService: AuthenticationService,

    private researcherService: ResearchService,
    private researchInstitutionService: ResearchInstitutionService,
    private participantsService: ParticipantService
  ) {}

  public filteredResearchInstForResearchersList: String[] = [];
  public filteredResearchInstForParticipantsList: String[] = [];
  public researcherUserNames: string[] =[];
  public participantUserNames: string[] =[];
  ResearchInstNames: string[] = [];
  researchInstitutionList: FFQResearchInstitution[];
  researcherList: FFQResearcher[] = [];
  participantsList: FfqParticipant[] = [];
  researchInstitutionLength: Number;

  ngOnInit() {
    this.showParticipants = true;
    this.showResearchers = true;

    this.loadAllUsers();
  }

//participants
  toggleParticipants() {
    this.showParticipants = !this.showParticipants;
  }

//researchers
  toggleResearcherUsers() {
    this.showResearchers = !this.showResearchers;
  }


//filterby research Institution
  filterByResearchInstitution(researchInst_name: string, filtered_researchInst: string[]) {
    const index = filtered_researchInst.indexOf(researchInst_name);
    if (index === -1) {
      filtered_researchInst.push(researchInst_name);
    } else {
      filtered_researchInst.splice(index, 1);
    }
  }

  /* Loads all users from the databases and pushes them into their respective lists to be displayed */
  private loadAllUsers() {

    var researchInstList: Observable<
    FFQResearchInstitution[]> =
    this.researchInstitutionService.getAllResearchInstitutions();
    researchInstList.subscribe((data) => {
        this.researchInstitutionList = data;
        data.forEach((researchInst) => {
        this.ResearchInstNames.push(researchInst.institutionName);
        this.researchInstitutionLength = data.length;
      });
    });

    var researcherUserList: Observable<
    FFQResearcher[]> = this.researcherService.getAllUsers();
     researcherUserList.subscribe((data) => {
        this.researcherList = data;

        for(var i = 0; i < data.length; i++)
      {
        this.researcherUserNames.push(data[i].firstname + " " + data[i].lastname);
      }
    });
     this.participantsService.getAllParticipants().subscribe((data) => {
       this.participantsList = data;

       for(let i = 0; i < data.length; i++)
       {
         this.participantUserNames.push(data[i].firstname + " " + data[i].lastname);
       }
     });
  }

  findAssignedResearcherForParticipant(participant: FfqParticipant) {
    return this.researcherList.find(researcher =>
      participant.assignedResearcherUsers.includes(researcher.userId)
    )
  }
}
