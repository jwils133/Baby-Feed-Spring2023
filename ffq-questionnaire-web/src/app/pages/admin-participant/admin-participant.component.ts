import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogPopupComponent } from "src/app/components/error-dialog-popup/error-dialog-popup.component";
import { combineLatest, Observable } from "rxjs";
import { ParticipantService } from "src/app/services/participant/participant-service";
import { ResearchService } from "src/app/services/research/research-service";
import { FfqParticipant } from "src/app/models/ffq-participant";
import { FFQResearcher } from "src/app/models/ffqresearcher";
import { ResearchInstitutionService } from "src/app/services/research-institution-service/research-institution-service";
import { FFQInstitution } from "src/app/models/ffqinstitution";
import { AuthenticationService } from "../../services/authentication/authentication.service";

import { FFQResearchInstitution } from "src/app/models/ffq-research-institution";
import { ClinicianService } from "../../services/clinician/clinician-service";

@Component({
  selector: "app-admin-participant",
  templateUrl: "./admin-participant.component.html",
  styleUrls: ["./admin-participant.component.css"],
})
export class ParticipantUserComponent implements OnInit {
  loggedInUser = this.authenticationService.currentUserValue;
  currentUser$: Observable<FFQResearcher[]>;
  currentUser: Observable<FFQResearcher[]>;

  // Used to make sure institutions do not go over participant cap
  numParticipants = 0;
  noMoreRoom = false;
  limit = 0;

  // Password for new participant user
  userPassword;

  // List for ALL institutions and ALL participants
  ffqinstitutionList: FFQInstitution[] = [];
  ffqparticipantList: FfqParticipant[] = [];
  selectedParticipants: FfqParticipant[] = [];

  // Current participant created and list of participants to be added
  ffqParticipant: FfqParticipant;
  ffqParticipants: FfqParticipant[] = [];

  // The institution's ID and name selected from dropdown
  selectedId: string;
  selectedName: string;

  // Number of participants to add
  numToAdd: number;

  prefix;
  suffix;
  lastUserId;
  participantName;

  constructor(
    public participantService: ParticipantService,
    public researchService: ResearchService,
    private errorDialog: MatDialog,
    private router: Router,
    public institutionService: ResearchInstitutionService,
    private authenticationService: AuthenticationService,
    public clinicianService: ClinicianService
  ) {
    this.currentUser$ = this.authenticationService
      .currentUser as unknown as Observable<FFQResearcher[]>;
    this.currentUser = this.currentUser$;
  }

  ngOnInit() {
    // On init get list of ALL institutions for drop down selection
    const institutionList: Observable<FFQResearchInstitution[]> =
      this.institutionService.getAllResearchInstitutions();
    institutionList.subscribe((a) => {
      this.ffqinstitutionList = a;
    });

    // Get all participants too
    const participantList: Observable<FfqParticipant[]> =
      this.participantService.getAllParticipants();
    participantList.subscribe((a) => {
      this.ffqparticipantList = a;
    });
  }

  /*
    A method that updates values when an instiution is selected

    It sets the limit given from the selected institution
    It sets selectedName to the selected institutions
    It sets numParticipants to the number of participants for selected instituion
    It makes an array of all the participants for selected institution
    It sets prefix to the first part the institutions name
  */
  handleChange() {
    this.numParticipants = 0;
    this.selectedParticipants = [];

    for (let i = 0; i < this.ffqinstitutionList.length; i++) {
      if (
        this.selectedId === this.ffqinstitutionList[i].researchInstitutionId
      ) {
        this.limit = this.ffqinstitutionList[i].participantsLimit;
        this.selectedName = this.ffqinstitutionList[i].institutionName;
        break;
      }
    }

    for (let i = 0; i < this.ffqparticipantList.length; i++) {
      if (
        this.selectedId === this.ffqparticipantList[i].assignedResearcherInst
      ) {
        this.numParticipants++;
        this.selectedParticipants.push(this.ffqparticipantList[i]);
      }
    }

    this.prefix = this.selectedName.substr(0, this.selectedName.indexOf(" "));
  }

  /*
    A method to ensure the participant(s) being add do not go over institutions limit

    numParticipants is the number of participants the instutions currently has
    numToAdd to the number set on the page, the number of participant account to make
    limit is the limit set by the institution

    noMoreRoom is set to true IF the number to be added will go over the limit and false otherwise
  */
  verifyLimit() {
    if (this.numParticipants + this.numToAdd > this.limit) {
      this.noMoreRoom = true;
    } else {
      this.noMoreRoom = false;
    }
  }

  /*
    The method called by "Add Participant(s)" button

    First verifies that it will not exceed limit
    Then calls createParticipants if it does not exceed limit AND there is a selected instituion
  */
  addParticipant() {
    this.verifyLimit();
    if (!this.noMoreRoom && !(this.selectedName === null)) {
      this.createParticipants();
    }
  }

  /*
    Once verified participants are created

    First clear list of all participants that were added
    Get the initial suffix

    Loop for the number needed to be added
        - First generate a random password for participant
        - Second create participant object using suffix for userId, prefix + _ + suffix for username, and generated password
        - Third add new participant object to list of participants to be added
        - Finally incrememnt suffix for next participant object to be made

    AFTER loop use participant service to add all participants on list
    Have a pop-up confirming number of participants added
  */
  createParticipants() {
    this.ffqParticipants = [];
    this.getSuffix();
    for (let i = 0; i < this.numToAdd; i++) {
      this.generatePassword();
      this.ffqParticipant = new FfqParticipant(
        this.suffix.toString(),
        this.prefix + "_" + this.suffix,
        this.userPassword,
        "participant",
        "",
        "",
        this.selectedId,
        [this.loggedInUser[0].userId],
        [""],
        true,
        this.prefix,
        []
      );
      this.ffqParticipants.push(this.ffqParticipant);
      this.suffix++;
    }

    this.participantService
      .addMultipleParticipants(this.ffqParticipants)
      .subscribe(
        (participant) => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            this.numToAdd + " participants(s) were added!";
        },
        (error) => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
          this.router.navigateByUrl("/admin/participant");
        }
      );
    this.ffqparticipantList = this.selectedParticipants.concat(
      this.ffqParticipants
    );
    this.selectedParticipants = this.selectedParticipants.concat(
      this.ffqParticipants
    );
    this.handleChange();
  }

  /*
    A method to get the suffix for the participant user
    If there are no other participants for the selected institution then set to 1
    Otherwise set to last participant on list +1
  */
  getSuffix() {
    if (this.selectedParticipants.length === 0) {
      this.suffix = 1;
    } else {
      this.lastUserId =
        this.selectedParticipants[this.selectedParticipants.length - 1].userId;
      this.suffix = parseInt(this.lastUserId, 10) + 1;
    }
  }

  /*
    A method used to make a random password
  */
  generatePassword() {
    this.userPassword = Math.random().toString(36).slice(-10);
  }
}
