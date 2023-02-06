/*

  Added by Javier Romero, edited by Khalid Alamoudi
  This is the home page of the clinician portal (clinic/home).
  It serves as the users page, where all parents and clinicians of that clinic can be seen and edited.

*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FFQClinician } from 'src/app/models/ffqclinician';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQClinic } from 'src/app/models/ffqclinic';
import { ParentService } from 'src/app/services/parent/parent-service';
import { ClinicianService } from 'src/app/services/clinician/clinician-service';
import { ClinicService } from 'src/app/services/clinic/clinic-service';
import { Observable } from 'rxjs';
import { FFQClinicianResponse } from 'src/app/models/ffqclinician-response';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { PatientPipe } from 'src/app/pipes/patientFilter.pipe';
import { SearchPipe } from 'src/app/pipes/searchFilter.pipe';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin/admin-service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-clinical-portal',
  templateUrl: './clinical-portal.component.html',
  styleUrls: ['./clinical-portal.component.css']
})

export class ClinicalPortalComponent implements OnInit  {

  public showClinicians: boolean;
  public showParents: boolean;
  public showClinics: boolean;
  private hideUnassignedParents: boolean;
  private hideUnassignedClinicians: boolean;
  p_search: string;
  c_search: string;
  loggedInUser = this.authenticationService.currentUserValue;
  private clinicParentLimit: number;
  private countDifPrefix: 0;

  constructor(
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    public clinicService: ClinicService,
    public adminService: AdminService,
    public authenticationService: AuthenticationService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    ) {
      this.authenticationService = authenticationService;
     }

  ffqclinicianList: FFQClinician[] = [];
  ffqparentList: FFQParent[] = [];
  ffqclinicList: FFQClinic[] = [];
  clinicNames: string[] = [];
  clinicianNames: string[] = [];
  clinicianUserNames: string[] = [];
  numberOfPatients: number[] = [];
  public filtered_clinicians: String[] = [];
  public filtered: boolean;
  private clinicId: string;
  private clinicianList: FFQClinician[] = [];
  private parentList: FFQParent[] = [];
  private clinicList: FFQClinic[] = [];
  public currentClinicName: string;
  public UserList: User[];
  public count: 0;

  ngOnInit() {

    this.showClinicians = true;
    this.showClinics = true;
    this.showParents = true;
    this.hideUnassignedParents = false;
    this.hideUnassignedClinicians = false;
    this.clinicianNames.push('');
    this.clinicianUserNames.push('');
    this.getClinicId();
  }

  toggleClinicians($event)
  {
    this.showClinicians = !this.showClinicians;
  }

  toggleClinics($event)
  {
    this.showClinics = !this.showClinics;
  }

  toggleParents($event)
  {
    this.showParents = !this.showParents;
  }

  toggleUnassignedParents($event)
  {
    this.hideUnassignedParents = !this.hideUnassignedParents;
  }

  toggleUnassignedClinicians($event)
  {
    this.hideUnassignedClinicians = !this.hideUnassignedClinicians;
  }

  filterByClinician(clinician_name: string)
  {
    const index = this.filtered_clinicians.indexOf(clinician_name);
    if (index === -1)
    {
      this.filtered_clinicians.push(clinician_name);
    }
    else
    {
      this.filtered_clinicians.splice(index, 1);
    }
    if (this.filtered_clinicians.length == 0)
    {
      this.filtered = false;
    }
    else
    {
      this.filtered = true;
    }
  }

  private getClinicId(){

    const clinicListObervable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();

    clinicListObervable.subscribe(clinicList => {
      const clinic = clinicList.find(a => a.clinicId == this.loggedInUser[0].assignedclinic);
      if (clinic){
        this.clinicId = clinic.clinicId;
        this.currentClinicName = clinic.clinicname;
      }
      this.getParents();
    });

  }

    // loadData function serves to store the result and parent names into the FFQParentResult object
    //                  serves to display the questionnaire-result data using the specification based on PO's list
  loadData(){
    const clinicianListObservable: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();

    clinicianListObservable.subscribe(clinicianList => {
        clinicianList.forEach(clinician => {
          if (clinician.assignedclinic === this.clinicId){
            this.clinicianList.push(clinician);
          }
        });
        // this.getNumberOfPatients();
        this.getClinicianNames();
        this.getClinics();
      });
  }

  getParents(){
    this.count = 0;
    const parentListObservable: Observable<FFQParentResponse[]> = this.parentService.getAllParents();

    parentListObservable.subscribe(parentList => {
      parentList.forEach(parent => {
        if (parent.assignedclinic === this.clinicId && parent.prefix === this.loggedInUser[0].prefix){
          this.parentList.push(parent);
        }
        if (parent.assignedclinic === this.loggedInUser[0].assignedclinic){
          this.count++;
        }
      });
      this.loadData();
    });
  }

  // getNumberOfPatients(){
  //   this.count = 0;
  //   // this.clinicianList.forEach(clinician => {
  //   this.parentList.forEach(parent => {
  //       // if (parent.assignedclinic === clinician.assignedclinic && clinician.assignedclinic === this.loggedInUser[0].assignedclinic ){
  //       if (parent.assignedclinic == this.loggedInUser[0].assignedclinic ){
  //         this.count++;
  //       }
  //     });
  //   this.numberOfPatients.push(this.count);
  //     // });
  // }

  getClinicianNames(){
    const clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    clinicianList.subscribe(a => {
      this.ffqclinicianList = a;
      for (let i = 0; i < a.length; i++) {
        this.clinicianNames.push(a[i].abbreviation + ' ' + a[i].firstname + ' ' + a[i].lastname);
        this.clinicianUserNames.push(a[i].username);
      }
    });
  }

  private getClinics(){

    const clinicListObervable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    const loggedInUser = this.authenticationService.currentUserValue;

    let clinicId: string;
    clinicListObervable.subscribe(clinicList => {
      clinicList.forEach(clinic => {
        if (clinic.clinicId === this.clinicId) {
          this.clinicList.push(clinic);
        }
        if (clinic.clinicId === this.loggedInUser[0].assignedclinic){
          this.clinicParentLimit = clinic.parentsLimit;
        }
      });

    });

  }

}

