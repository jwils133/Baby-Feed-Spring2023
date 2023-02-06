/*

  Added by Javier Romero
  This page represents the clinics page in the admin portal.
  From here, you can see a list of all the clinics in the DB and can also edit/delete them.

*/

import { Component, OnInit } from '@angular/core';
import { FFQClinic } from 'src/app/models/ffqclinic';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQResearcherParent } from 'src/app/models/ffqresearcherparent';
import { FFQClinician } from 'src/app/models/ffqclinician';
import { Observable } from 'rxjs';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { FFQClinicianResponse } from 'src/app/models/ffqclinician-response';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { ClinicService } from 'src/app/services/clinic/clinic-service';
import { ParentService } from 'src/app/services/parent/parent-service';
import { ResearcherParentService } from 'src/app/services/researcher-parent/researcher-parent-service';
import { ClinicianService } from 'src/app/services/clinician/clinician-service';
import { ClinicianPipe } from 'src/app/pipes/clinicianFilter.pipe';
import { ParentPipe } from 'src/app/pipes/parentFilter.pipe';

@Component({
  templateUrl: './admin-clinics.component.html',
  styleUrls: ['./admin-clinics.component.css']
})

export class AdminClinicsComponent implements OnInit {

  constructor(

    public clinicService: ClinicService,
    public clinicianService: ClinicianService,
    public parentService: ParentService,

  ){}

  public ffqclinicList: FFQClinic[] = [];
  public ffqclinicianList: FFQClinician[] = [];
  public ffqparentList: FFQParent[] = [];
  public clinicianNames: string[] =[];


  /* Loads all the data necessary to fill out the table in the html component */
  ngOnInit() {

    this.clinicianNames.push("");

    const clinicList: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    clinicList.subscribe(a => {
      this.ffqclinicList = a;
    });

    var clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    clinicianList.subscribe(a => {
      this.ffqclinicianList = a;
      for(var i = 0; i < a.length; i++)
      {
        this.clinicianNames.push(a[i].abbreviation + " " + a[i].firstname + " " + a[i].lastname);
      }
    });

    var parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();
    parentList.subscribe(a => {
      this.ffqparentList = a;
    });

  }
}
