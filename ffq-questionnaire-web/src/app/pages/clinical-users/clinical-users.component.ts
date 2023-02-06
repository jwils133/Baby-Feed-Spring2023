import {Component, OnInit} from "@angular/core";
import {FFQClinician} from "src/app/models/ffqclinician";
import {FFQParent} from "src/app/models/ffqparent";
import {FFQAdmin} from "src/app/models/ffqadmin";
import {FFQClinicianResponse} from "src/app/models/ffqclinician-response";
import {ParentService} from "src/app/services/parent/parent-service";
import {ClinicianService} from "src/app/services/clinician/clinician-service";
import {Observable} from "rxjs";
import {FFQParentResponse} from "src/app/models/ffqparent-response";
import {FFQClinicResponse} from "src/app/models/ffqclinic-response";
import {FFQAdminResponse} from "src/app/models/ffqadmin-response";
import {ClinicService} from "src/app/services/clinic/clinic-service";
import {AdminService} from "src/app/services/admin/admin-service";
import {ResearchService} from "src/app/services/research/research-service";
import {FFQClinic} from "src/app/models/ffqclinic";
import {AuthenticationService} from "src/app/services/authentication/authentication.service";
import {FFQResearcher} from "src/app/models/ffqresearcher";
import {Usertype} from "../../models/usertype.enum";

@Component({
  templateUrl: "./clinical-users.component.html",
  styleUrls: ["./clinical-users.component.css"],
})
export class ClinicalUsersComponent implements OnInit {
  private showParents: boolean;
  private showClinicians: boolean;
  private showAdmins: boolean;
  private showResearch: boolean;

  search: string;

  constructor(
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    public clinicService: ClinicService,
    public adminService: AdminService,
    public researchService: ResearchService,
    public authenticationService: AuthenticationService
  ) {
  }

  ffqclinicianList: FFQClinician[] = [];
  ffqparentList: FFQParent[] = [];
  ffqclinicList: FFQClinic[] = [];
  ffqadminList: FFQAdmin[] = [];
  ffqresearchList: FFQResearcher[] = [];
  clinicianClinicNames: string[] = [];
  parentClinicNames: string[] = [];
  clinicNames: string[] = [];
  public filtered: boolean;
  public filtered_clinics: String[] = [];
  usertype = Usertype;

  ngOnInit() {
    this.clinicNames.push("");
    this.showParents = true;
    this.showClinicians = true;
    this.showAdmins = true;
    this.showResearch = true;
    this.filtered = false;
    this.loadAllUsers();
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

  filterByClinic(clinic_name: string) {
    const index = this.filtered_clinics.indexOf(clinic_name);
    if (index === -1) {
      this.filtered_clinics.push(clinic_name);
    } else {
      this.filtered_clinics.splice(index, 1);
    }
    if (this.filtered_clinics.length == 0) {
      this.filtered = false;
    } else {
      this.filtered = true;
    }
  }

  /* Loads all users from the databases and pushes them into their respective lists to be displayed */
  private loadAllUsers() {
    var clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    var parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();
    var clinicList: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    var adminList: Observable<FFQAdminResponse[]> = this.adminService.getAllUsers();
    var researchList: Observable<FFQResearcher[]> = this.researchService.getAllUsers();

    clinicList.subscribe((a) => {
      this.ffqclinicList = a;
      a.forEach((clinic) => {
        this.clinicNames.push(clinic.clinicname);
      });

      clinicianList.subscribe((b) => {
        this.ffqclinicianList = b;

        b.forEach((clinician) => {
          var clinicianClinic = a.find(
            (n) => n.clinicId == clinician.assignedclinic
          );

          if (!!clinicianClinic) {
            var clinicianClinicName = clinicianClinic.clinicname;
            this.clinicianClinicNames.push(clinicianClinicName);
          }
        });
        parentList.subscribe((c) => {
          this.ffqparentList = c;

          c.forEach((parent) => {
            var clinicians = b.find((n) => n.userId == parent.assignedclinic);

            if (!!clinicians) {
              var parentClinic = a.find(
                (n) => n.clinicId == clinicians.assignedclinic
              );
              if (!!parentClinic) {
                var parentClinicName = parentClinic.clinicname;
              }
            }
            this.parentClinicNames.push(parentClinicName);
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
