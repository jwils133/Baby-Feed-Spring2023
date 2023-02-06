/*

    Added by Javier Romero
    Pop-up that prompts the user to confirm deletion of an object in the database.
    Added to prevent the accidental deletion of clinics,
    clinicians or parents from the database.

*/

import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogPopupComponent } from "../error-dialog-popup/error-dialog-popup.component";
import { FFQClinicianResponse } from "src/app/models/ffqclinician-response";
import { ClinicianService } from "src/app/services/clinician/clinician-service";
import { ParentService } from "src/app/services/parent/parent-service";
import { ClinicService } from "src/app/services/clinic/clinic-service";
import { FFQClinicResponse } from "src/app/models/ffqclinic-response";
import {ResearchService} from "src/app/services/research/research-service";
import {ResearchInstitutionService} from "src/app/services/research-institution-service/research-institution-service"
import {FFQInstitutionResponse} from "src/app/models/ffqinstitution-response";
import {FFQResultsResponse} from '../../models/ffqresultsresponse';
import {combineLatest} from "rxjs";
import {ResultsService} from "../../services/results/results.service";
import {FFQResearcher} from "../../models/ffqresearcher";
import {FfqParticipant} from "../../models/ffq-participant";
import {ParticipantService} from "../../services/participant/participant-service";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css'],
})
export class DeletePopupComponent implements OnInit {
  // @Input attributes: the object and its attributes to be deleted
  // @Input service: the type of the object
  @Input() attributes;
  @Input() service;

  isParent = false;
  isClinician = false;
  isClinic = false;
  isResearch = false;
  isResearch_institution = false;
  isQuestionnaire = false;
  hidden = true;
  isParticipant = false;

  ngOnInit() {
    if (this.service == 'Clinician') { this.isClinician = true; }
    else if (this.service == 'Parent') { this.isParent = true; }
    else if (this.service == 'Clinic') { this.isClinic = true; }
    else if (this.service == 'Researcher') { this.isResearch = true; }
    else if (this.service == 'Participant') { this.isParticipant = true; }
    else if (this.service == 'Research-institution') { this.isResearch_institution = true; }
    else if (this.service == 'Questionnaire') { this.isQuestionnaire = true; }
  }

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private errorDialog: MatDialog,
    private clinicianService: ClinicianService,
    private parentService: ParentService,
    private participantService: ParticipantService,
    private clinicService: ClinicService,
    private researchService: ResearchService,
    private researchInstitutionService: ResearchInstitutionService,
    private resultsService: ResultsService
  ) {}

  /* When confirmed deletion, this function does the delete action on the object based on its type */
  onClose(): void {
    if (this.isClinician) {
      let userName = (this.attributes as FFQClinicianResponse).username;
      this.clinicianService
        .deleteItem((this.attributes as FFQClinicianResponse).userId)
        .subscribe((user) => {
          this.router.navigateByUrl('/admin/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            'Clinician ' + userName + ' was deleted';
        });
    } else if (this.isParent) {
      let userName = (this.attributes as FFQClinicianResponse).username;
      combineLatest([this.parentService
        .deletePatient((<FFQClinicianResponse>this.attributes).userId),
        this.resultsService.deleteItemsByParentId((<FFQClinicianResponse>this.attributes).userId)])
        .subscribe(([user, results]) => {
          this.router.navigateByUrl("/admin/users");
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            'Parent ' + userName + ' was deleted';
        });
    } else if (this.isParticipant) {
      let userName = (this.attributes as FfqParticipant).username;
      this.participantService
        .deleteItem((<FfqParticipant>this.attributes).userId)
        .subscribe((user) => {
          this.router.navigateByUrl(environment.routes.adminResearchUsersRoute);
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            'Participant ' + userName + ' was deleted';
        });
    } else if (this.isClinic) {
      let clinicName = (this.attributes as FFQClinicResponse).clinicname;
      this.clinicService
        .deleteItem((this.attributes as FFQClinicResponse).clinicId)
        .subscribe((clinic) => {
          this.router.navigateByUrl('/admin/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            'Clinic ' + clinicName + ' was deleted';
        });
    }
    else if (this.isResearch) {
      let researchName = (this.attributes as FFQResearcher).username;
      this.researchService
        .deleteItem((this.attributes as FFQResearcher).userId)
        .subscribe((data) => {
          this.router.navigateByUrl('/admin/research/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            'Researcher: ' + researchName + ' was deleted';
        });
    }
    else if (this.isResearch_institution) {

      let researchInstitutionName = (this.attributes as FFQInstitutionResponse).institutionName;

      this.researchInstitutionService
        .deleteItem((this.attributes as FFQInstitutionResponse).researchInstitutionId)
        .subscribe((data) => {
          this.router.navigateByUrl('/admin/research/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title =
            'Research Institution: ' + researchInstitutionName + ' was deleted';
        });
    }
    else if (this.isQuestionnaire){
      const questionnaireId = (this.attributes as FFQResultsResponse).questionnaireId;
      this.resultsService.
        deleteItem(questionnaireId)
          .subscribe(() => {
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title =
              'Result ' + questionnaireId + ' was deleted';
            window.location.reload();
          });
    }
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }
}
