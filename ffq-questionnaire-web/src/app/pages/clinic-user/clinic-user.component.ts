/*

  Added by Javier Romero
  This is the edit user page for the clinician portal (clinic/user).
  From here, the clinician can edit parents/clinicians that are assigned to the clinic.
  Parents can also be assigned to an existing clinician here.

*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { ParentService } from 'src/app/services/parent/parent-service';
import { ClinicianService } from 'src/app/services/clinician/clinician-service';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { FFQClinician } from 'src/app/models/ffqclinician';
import { FFQClinicianResponse } from 'src/app/models/ffqclinician-response';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeletePopupComponent } from "src/app/components/delete-popup/delete-popup.component";

@Component({
  selector: 'app-new-clinic',
  templateUrl: './clinic-user.component.html',
  styleUrls: ['./clinic-user.component.css']
})
export class ClinicUserComponent implements OnInit {

  userAttributes: FFQClinician | FFQParent;
  public ffqclinicianList: FFQClinician[] = [];
  clinicianNames: string[] = [];

  // for updating user

  private isParent: boolean;
  private isClinician: boolean;

  constructor(
    private route: ActivatedRoute,
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    private router: Router,
    private errorDialog: MatDialog,
    private modalService: NgbModal
    ){}

  dataLoaded: Promise<boolean>;

  ngOnInit() {

    // updating user

    this.isParent = false;
    this.isClinician = false;

    this.clinicianNames.push("");

    const clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    clinicianList.subscribe(a => {
      this.ffqclinicianList = a;
      for (let i = 0; i < a.length; i++) {
        this.clinicianNames.push(a[i].abbreviation + " " + a[i].firstname + " " + a[i].lastname);
      }
    });

    const UserID = this.route.snapshot.paramMap.get('id');
    const UserType = this.route.snapshot.paramMap.get('type');

    if(UserType == "p")
    {
      this.isParent = true;
      this.getParentByID(UserID);
    }
    else
    {
      this.isClinician = true;
      this.getClinicianByID(UserID);
    }
  }

  getParentByID(id: string)
  {
    this.parentService.getParent(id).subscribe(data => {
      this.userAttributes = data;
    });
    this.dataLoaded = Promise.resolve(true);
  }

  getClinicianByID(id: string)
  {
    this.clinicianService.getClinician(id).subscribe(data => {
      this.userAttributes = data;
    });
    this.dataLoaded = Promise.resolve(true);
  }

  updateUser()
  {
    if(this.isParent)
    {
      this.updateParent();
    }
    else
    {
      this.updateClinician();
    }
  }

  updateParent()
  {
    this.parentService.updateParent(<FFQParentResponse>this.userAttributes).subscribe(
     data => {this.router.navigateByUrl('/clinic/home');
     const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
     dialogRef.componentInstance.title = 'Parent successfully updated!';}

    );
  }

  updateClinician()
  {
    this.clinicianService.updateClinician(<FFQClinicianResponse>this.userAttributes).subscribe(
     data => {this.router.navigateByUrl('/clinic/home');
     const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
     dialogRef.componentInstance.title = 'Clinician successfully updated!';}

    );
  }

  deleteUser()
  {
    if(this.isParent)
    {
      this.deleteParent();
    }
    else
    {
      this.deleteClinician();
    }
  }

  deleteParent()
  {
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = "Parent";
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }

  deleteClinician()
  {
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = "Clinician";
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }

  generatePassword() {
    this.userAttributes.userpassword = Math.random().toString(36).slice(-10);
  }
}
