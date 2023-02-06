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
import { Usertype } from "../../models/usertype.enum";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { skipWhile, take } from "rxjs/operators";
import { FFQInstitutionResponse } from "../../models/ffqinstitution-response";

@Component({
  selector: "app-research-new-user",
  templateUrl: "./research-new-user.component.html",
  styleUrls: ["./research-new-user.component.css"],
})
export class ResearchNewUserComponent implements OnInit {
  loggedInUser = this.authenticationService.currentUserValue;
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    showLabels: false,
    headers: [],
    showTitle: true,
    title: "User Info",
    titles: "User Info",
    useBom: false,
    removeNewLines: true,
    keys: ["userName", "password"],
  };
  data = [];
  selectedInstitution: FFQInstitution;
  userType = Usertype.participant;
  userTypes = Usertype;
  ffqParticipant: FfqParticipant;
  ffqInstitutionList$: Observable<FFQInstitution[]>;
  usersQuantity = 1;
  currentUser$: Observable<FFQResearcher[]>;
  currentUser: Observable<FFQResearcher[]>;
  clicked = false;
  noMoreRoom = false;
  // limit = this.loggedInUser[0].limitNumberOfParticipants;
  limit = 0;
  numParticipants = 0;
  prefix =
    this.loggedInUser[0].prefix === undefined
      ? ""
      : this.loggedInUser[0].prefix;
  lastUserId;
  suffix;
  userPassword;
  dissabled = false;
  intialLoad = true;
  initial = true;
  testing = [];
  newParticipants = [];
  loggedInInstitutionName;
  participantName: string;
  toStrip: string;
  max = 0;
  newNumber: number;
  notFound = true;
  noUsers: boolean;

  constructor(
    public participantService: ParticipantService,
    public researchService: ResearchService,
    private errorDialog: MatDialog,
    private router: Router,
    public institutionService: ResearchInstitutionService,
    private authenticationService: AuthenticationService
  ) {
    this.ffqInstitutionList$ =
      this.institutionService.getAllResearchInstitutions();
    this.currentUser$ = this.authenticationService
      .currentUser as unknown as Observable<FFQResearcher[]>;
    this.currentUser = this.currentUser$;
  }

  numberOfPatients: number[] = [];
  ffqparticipantList: FfqParticipant[] = [];
  ffqinstitutionList: FFQInstitution[] = [];

  ngOnInit() {
    combineLatest([this.currentUser$, this.ffqInstitutionList$])
      .pipe(
        skipWhile(
          ([users, institutions]) =>
            users.length === 0 || institutions.length === 0
        ),
        take(1)
      )
      .subscribe(([user, institution]) => {
        this.selectedInstitution = institution.find((i) => {
          console.log(i.researchInstitutionId);
          console.log(user[0].assignedResearchInstitutionId);
          return (
            i.researchInstitutionId === user[0].assignedResearchInstitutionId
          );
        });
      });

    const participantList: Observable<FfqParticipant[]> =
      this.participantService.getAllParticipants();
    participantList.subscribe((a) => {
      this.ffqparticipantList = a;
    });
    const institutionList: Observable<FFQInstitutionResponse[]> =
      this.institutionService.getAllResearchInstitutions();
    institutionList.subscribe((a) => {
      this.ffqinstitutionList = a;
    });
  }
  getInstiutionName() {
    for (const item of this.ffqinstitutionList) {
      if (
        this.loggedInUser[0].assignedResearchInstitutionId ===
        item.researchInstitutionId
      ) {
        this.loggedInInstitutionName = item.institutionName;
      }
    }
  }
  countParticipants() {
    for (let i = 0; i < this.ffqinstitutionList.length; i++) {
      if (
        this.loggedInUser[0].assignedResearchInstitutionId ===
        this.ffqinstitutionList[i].researchInstitutionId
      ) {
        this.limit = this.ffqinstitutionList[i].participantsLimit;
        break;
      }
    }
    for (let i = 0; i < this.ffqparticipantList.length; i++) {
      if (
        this.loggedInUser[0].assignedResearchInstitutionId ===
        this.ffqparticipantList[i].assignedResearcherInst
      ) {
        this.numParticipants++;
      }
    }
    if (this.limit - this.numParticipants <= 0) {
      this.noMoreRoom = true;
    }
  }
  addUser() {
    switch (this.userType) {
      case Usertype.participant: {
        if (this.usersQuantity === 1) {
          this.addParticipant();
        } else {
          this.addMultipleParticipants();
        }
        break;
      }
    }
  }

  getSuffix() {
    if (this.ffqparticipantList.length === 0) {
      this.suffix = 1;
    } else {
      this.lastUserId =
        this.ffqparticipantList[this.ffqparticipantList.length - 1].userId;
      this.suffix = parseInt(this.lastUserId, 10) + 1;
    }
  }

  userNameCreator() {
    for (let i = 0; i <= this.ffqparticipantList.length - 1; i++) {
      if (
        this.ffqparticipantList[i].assignedResearcherInst ===
          this.loggedInUser[0].assignedResearchInstitutionId &&
        this.ffqparticipantList[i].prefix === this.loggedInUser[0].prefix
      ) {
        this.notFound = false;
        this.toStrip = this.prefix + "_";
        this.newNumber = parseInt(
          this.ffqparticipantList[i].username.replace(this.toStrip, ""),
          10
        );

        if (this.newNumber > this.max) {
          this.max = this.newNumber;
        }
        this.participantName = this.prefix + "_" + (this.max + 1).toString();
      }
      if (this.ffqparticipantList.length - 1 === i && this.notFound) {
        // multiple participants added
        this.toStrip = this.prefix + "_";
        // one participant added
        this.participantName = this.prefix + "_1";
      }
    }
  }
  addParticipant() {
    this.getSuffix();
    this.generatePassword();
    if (this.ffqparticipantList.length === 0) {
      this.participantName = this.prefix + "_1";
      this.ffqParticipant = new FfqParticipant(
        "",
        this.participantName,
        this.userPassword,
        "participant",
        "",
        "",
        this.selectedInstitution.researchInstitutionId,
        [this.loggedInUser[0].userId],
        [""],
        true,
        this.prefix,
        []
      );
      this.noUsers = true;
    }
    if (!this.noUsers) {
      if (this.prefix === "") {
        this.prefix = "participant";
        this.ffqParticipant = new FfqParticipant(
          "",
          "",
          this.userPassword,
          "participant",
          "",
          "",
          this.selectedInstitution.researchInstitutionId,
          [this.loggedInUser[0].userId],
          [""],
          true,
          this.prefix,
          []
        );
      } else {
        this.userNameCreator();
        this.ffqParticipant = new FfqParticipant(
          "",
          this.participantName,
          this.userPassword,
          "participant",
          "",
          "",
          this.selectedInstitution.researchInstitutionId,
          [this.loggedInUser[0].userId],
          [""],
          true,
          this.prefix,
          []
        );
      }
    }
    this.participantService.addParticipant(this.ffqParticipant).subscribe(
      (participant) => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title =
          participant.username + " was added!";
        this.save2csvSingleParticipant();
        this.dissabled = true;
      },
      (error) => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
        this.router.navigateByUrl("/research/home");
      }
    );
  }
  dataLoop() {
    for (let i = 0; i < 7; i++) {
      this.data[i] = [
        {
          userName: "",
          password: "",
        },
      ];
    }
  }
  save2csvSingleParticipant() {
    this.getInstiutionName();
    this.dataLoop();

    this.data[0].userName = "Assingned institution: ";
    this.data[0].password = this.loggedInInstitutionName;
    this.data[1].userName = "Assingned institution ID: ";
    this.data[1].password = this.loggedInUser[0].assignedResearchInstitutionId;
    this.data[2].userName = "Assingned researcher: ";
    this.data[2].password = this.loggedInUser[0].username;
    this.data[3].userName = "";
    this.data[3].password = "";
    this.data[4].userName = "User Name";
    this.data[4].password = "Password";
    this.data[5].userName = "";
    this.data[5].password = "";
    this.data[6].userName = this.participantName;
    this.data[6].password = this.userPassword;
  }
  dataLoopMultiple() {
    for (let i = 0; i < this.newParticipants.length + 6; i++) {
      this.data[i] = [
        {
          userName: "",
          password: "",
        },
      ];
    }
  }
  save2csvMultipleParticipant() {
    this.getInstiutionName();
    this.dataLoopMultiple();
    this.data[0].userName = "Assingned institution: ";
    this.data[0].password = this.loggedInInstitutionName;
    this.data[1].userName = "Assingned institution ID: ";
    this.data[1].password = this.loggedInUser[0].assignedResearchInstitutionId;
    this.data[2].userName = "Assingned researcher: ";
    this.data[2].password = this.loggedInUser[0].username;
    this.data[3].userName = "";
    this.data[3].password = "";
    this.data[4].userName = "User Name";
    this.data[4].password = "Password";
    this.data[5].userName = "";
    this.data[5].password = "";

    for (let i = 0; i < this.newParticipants.length; i++) {
      this.data[i + 6].userName = this.newParticipants[i].username;
      this.data[i + 6].password = this.newParticipants[i].userpassword;
    }
  }
  addMultipleParticipants() {
    if (this.usersQuantity <= this.limit - this.numParticipants) {
      this.getSuffix();
      if (this.ffqparticipantList.length === 0) {
        this.participantName = this.prefix + "_1";
        this.toStrip = this.prefix + "_";
        for (let i = 0; i < this.usersQuantity; i++) {
          this.generatePassword();
          this.newParticipants.push(
            new FfqParticipant(
              "",
              this.participantName,
              this.userPassword,
              "participant",
              "",
              "",
              this.selectedInstitution.researchInstitutionId,
              [this.loggedInUser[0].userId],
              [""],
              true,
              this.prefix,
              []
            )
          );
          this.newNumber =
            parseInt(this.participantName.replace(this.toStrip, ""), 10) + 1;
          this.participantName = this.toStrip + this.newNumber.toString();
        }
        this.noUsers = true;
      }
      if (!this.noUsers) {
        if (this.prefix === "") {
          this.prefix = "participant";
          for (let i = 0; i < this.usersQuantity; i++) {
            this.prefix = this.ffqinstitutionList[0].institutionName;
            this.generatePassword();
            this.newParticipants.push(
              new FfqParticipant(
                "",
                this.participantName,
                this.userPassword,
                "participant",
                "",
                "",
                this.selectedInstitution.researchInstitutionId,
                [this.loggedInUser[0].userId],
                [""],
                true,
                this.prefix,
                []
              )
            );
            this.suffix++;
          }
        } else {
          this.userNameCreator();
          for (let i = 0; i < this.usersQuantity; i++) {
            this.generatePassword();
            this.newParticipants.push(
              new FfqParticipant(
                "",
                this.participantName,
                this.userPassword,
                "participant",
                "",
                "",
                this.selectedInstitution.researchInstitutionId,
                [this.loggedInUser[0].userId],
                [""],
                true,
                this.prefix,
                []
              )
            );

            this.newNumber =
              parseInt(this.participantName.replace(this.toStrip, ""), 10) + 1;
            this.participantName = this.toStrip + this.newNumber.toString();
          }
        }
      }
      this.participantService
        .addMultipleParticipants(this.newParticipants)
        .subscribe(
          (researchers) => {
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title =
              this.usersQuantity + " users were added.";
            console.log(this.newParticipants[0].username);
            this.save2csvMultipleParticipant();
            this.dissabled = true;
          },
          (error) => {
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title = error.error.message;
            this.router.navigateByUrl("/research/home");
          }
        );
    } else {
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title =
        "<center>Cannot add more Participants than allowed limit<br/> " +
        "Contact admin if this is an error or to increase limit<br/></center>";
    }
  }
  generatePassword() {
    this.userPassword = Math.random().toString(36).slice(-10);
  }
}
