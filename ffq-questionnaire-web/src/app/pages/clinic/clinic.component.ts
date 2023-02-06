/*

  Added by Javier Romero
  This is the create/edit clinics page from the admin portal (admin/clinic).
  From here, the admin will create a clinic and define its attributes or edit an existing one.
  Existing clinics can also be deleted here.

*/

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ClinicianService} from 'src/app/services/clinician/clinician-service';
import {FFQClinicianResponse} from 'src/app/models/ffqclinician-response';
import {FFQClinician} from 'src/app/models/ffqclinician';
import {FFQClinicResponse} from 'src/app/models/ffqclinic-response';
import {ClinicService} from 'src/app/services/clinic/clinic-service';
import {FFQClinic} from 'src/app/models/ffqclinic';
import {ParentService} from 'src/app/services/parent/parent-service';
import {FFQParentResponse} from 'src/app/models/ffqparent-response';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeletePopupComponent} from "src/app/components/delete-popup/delete-popup.component";


@Component({
  selector: 'app-new-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent implements OnInit, OnDestroy {

  isNew: boolean;
  isUpdate: boolean;
  name_of_clinic: string;
  cliniciansLimit: number;
  parentsLimit: number;
  location: string;
  private subscriptions = [];
  clinicians: FFQClinicianResponse[] = [];
  parents: FFQParentResponse[] = [];
  clinicAttributes: FFQClinic;
  dataLoaded: Promise<boolean>;
  ffqclinic: FFQClinic;
  clinicnumber: number;
  clinic: number;
  public ffqclinicianList: FFQClinician[] = [];
  clinicianNames: string[] = [];
  ffqclinicList: FFQClinic[] = [];
  curClinId;
  newClinicId;
  constructor(
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public clinicService: ClinicService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.clinicianNames.push("");
    const UserID = this.route.snapshot.paramMap.get('id');
    if (UserID == "new") {
      this.isNew = true;
      this.clinicnumber = this.clinic;
      this.dataLoaded = Promise.resolve(true);
    } else {
      this.isUpdate = true;
      this.getClinicById(UserID);
    }

    var clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    this.subscriptions.push(clinicianList.subscribe(a => {
      this.ffqclinicianList = a;
      for (let i = 0; i < a.length; i++) {
        this.clinicianNames.push(a[i].abbreviation + " " + a[i].firstname + " " + a[i].lastname);
      }
    }));

    const clinList: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    clinList.subscribe(a => {
      this.ffqclinicList = a;
    });
  }

  getClinId(){
    if (this.ffqclinicList.length === 0){
      this.newClinicId = 1;
    } else {
    this.curClinId = this.ffqclinicList[this.ffqclinicList.length - 1].clinicId;
    this.newClinicId = parseInt(this.curClinId, 10) + 1;
  }}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addClinic(form: NgForm) {
    var clinicList: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    this.getClinId();
    clinicList.subscribe(data => {
      this.ffqclinic = new FFQClinic(this.newClinicId, this.location, "", this.name_of_clinic, "", false, this.cliniciansLimit, this.parentsLimit);
      this.clinicService.addClinic(this.ffqclinic).subscribe(data => {
          this.router.navigateByUrl('/admin/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = 'Clinic with id ' + this.newClinicId + ' was added!';
        },
        error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
        });

    });
  }

  private getClinicById(id: string) {
    this.subscriptions.push(this.clinicService.getClinic(id).subscribe(data => {
      this.clinicAttributes = data;
    }));
    this.dataLoaded = Promise.resolve(true);
  }

  updateClinic() {
    this.clinicService.updateClinic(<FFQClinicResponse> this.clinicAttributes).subscribe(
      data => {
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = 'Clinic successfully updated!';
      }
    );
  }

  deleteClinic() {
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = "Clinic";
    confirmDelete.componentInstance.attributes = this.clinicAttributes;
  }
}




