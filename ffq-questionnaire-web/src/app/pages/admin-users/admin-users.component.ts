/*

  Added by Javier Romero
  This is the users page on the admin portal (admin/users).
  From here, the admin can create, delete, and assign parents/clinicians to their clinics.
  Khalid Alamoudi: wrote loadAllUsers() function that populates clinicians/parents lists.

*/

import { Component, OnInit } from '@angular/core';
import { FFQClinician } from 'src/app/models/ffqclinician';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQAdmin } from 'src/app/models/ffqadmin';
import { FFQClinicianResponse } from 'src/app/models/ffqclinician-response';
import { ParentService } from 'src/app/services/parent/parent-service';
import { ClinicianService } from 'src/app/services/clinician/clinician-service';
import { Observable } from 'rxjs';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { FFQAdminResponse } from 'src/app/models/ffqadmin-response';
import { ClinicService } from 'src/app/services/clinic/clinic-service';
import { AdminService } from 'src/app/services/admin/admin-service';
import { ResearchService } from 'src/app/services/research/research-service';
import { FFQClinic } from 'src/app/models/ffqclinic';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FFQResearcher } from 'src/app/models/ffqresearcher';
import {Usertype} from "../../models/usertype.enum";

@Component({
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  private showParents: boolean;
  private showClinicians: boolean;
  private showAdmins: boolean;
  private showResearch: boolean;
  searchClinicians: string;
  searchClinics: string;
  parentClinicName: any;
  constructor(
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    public clinicService: ClinicService,
    public adminService: AdminService,
    public researchService: ResearchService,
    public authenticationService: AuthenticationService
  ) {}

  ffqclinicianList: FFQClinician[] = [];
  ffqparentList: FFQParent[] = [];
  ffqclinicList: FFQClinic[] = [];
  ffqadminList: FFQAdmin[] = [];
  ffqresearchList: FFQResearcher[] = [];
  clinicianClinicNames: string[] = [];
  parentClinicNames: string[] = [];
  clinicNames: string[] = [];
  public filtered: boolean;
  public filteredClinics: string[] = [];
  public clinicianNames: string[] = [];
  usertype = Usertype;

  ngOnInit() {
    this.clinicNames.push('');
    this.showParents = true;
    this.showClinicians = true;
    this.showAdmins = true;
    this.showResearch = true;
    this.filtered = false;
    this.loadAllUsers();
    this.clinicianNames.push('');
    const clinicList: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    clinicList.subscribe(a => {
      this.ffqclinicList = a;
    });

    const clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    clinicianList.subscribe(a => {
      this.ffqclinicianList = a;

      a.forEach(item => {
        this.clinicianNames.push(item.abbreviation + ' ' + item.firstname + ' ' + item.lastname);
      });
    });
  }

  toggleParents() {
    this.showParents = !this.showParents;
  }

  toggleClinicians() {
    this.showClinicians = !this.showClinicians;
  }

  toggleAdmins() {
    this.showAdmins = !this.showAdmins;
  }

  toggleResearch() {
    this.showResearch = !this.showResearch;
  }


  filterByClinic(clinicName: string) {
    const index = this.filteredClinics.indexOf(clinicName);
    if (index === -1) {
      this.filteredClinics.push(clinicName);
    } else {
      this.filteredClinics.splice(index, 1);
    }
    this.filtered = this.filteredClinics.length !== 0;
  }

  /* Loads all users from the databases and pushes them into their respective lists to be displayed */

  private loadAllUsers() {
    const clinicianList: Observable<
      FFQClinicianResponse[]
    > = this.clinicianService.getAllClinicians();
    const parentList: Observable<
      FFQParentResponse[]
    > = this.parentService.getAllParents();
    const clinicList: Observable<
      FFQClinicResponse[]
    > = this.clinicService.getAllClinics();
    const adminList: Observable<
      FFQAdminResponse[]
    > = this.adminService.getAllUsers();
    const researchList: Observable<
      FFQResearcher[]
    > = this.researchService.getAllUsers();

    clinicList.subscribe((a) => {
      this.ffqclinicList = a;
      a.forEach((clinic) => {
        this.clinicNames.push(clinic.clinicname);
      });

      clinicianList.subscribe((b) => {
        this.ffqclinicianList = b;

        b.forEach((clinician) => {
          const clinicianClinic = a.find(
            (n) => n.clinicId === clinician.assignedclinic
          );

          if (!!clinicianClinic) {
            const clinicianClinicName = clinicianClinic.clinicname;
            this.clinicianClinicNames.push(clinicianClinicName);
          }
        });
        parentList.subscribe((c) => {
          this.ffqparentList = c;

          c.forEach((parent) => {
            const clinicians = b.find((n) => n.userId === parent.assignedclinic);

            if (!!clinicians) {
              const parentClinic = a.find(
                (n) => n.clinicId === clinicians.assignedclinic
              );
              if (!!parentClinic) {
                this.parentClinicName = parentClinic.clinicname;
              }
            }
            this.parentClinicNames.push(this.parentClinicName);
          });
        });
      });
    });

    adminList.subscribe((admin) => {
      this.ffqadminList = admin;
    });

    researchList.subscribe((research) => {
      this.ffqresearchList = research;
    });
  }
}
