/*

  Added by Javier Romero
  This is the create/edit user page for the admin portal
  (admin/user, which differs from admin/users, which is the list all users page).
  From here, the admin will create users or edit existing ones.
  Users can also be deleted from the databases from here.

*/

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {Observable} from 'rxjs';
import {ParentService} from 'src/app/services/parent/parent-service';
import {ClinicianService} from 'src/app/services/clinician/clinician-service';
import {FFQClinicianResponse} from 'src/app/models/ffqclinician-response';
import {FFQParent} from 'src/app/models/ffqparent';
import {FFQClinician} from 'src/app/models/ffqclinician';
import {FFQParentResponse} from 'src/app/models/ffqparent-response';
import {FFQClinicResponse} from 'src/app/models/ffqclinic-response';
import {ClinicService} from 'src/app/services/clinic/clinic-service';
import {FFQClinic} from 'src/app/models/ffqclinic';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeletePopupComponent} from 'src/app/components/delete-popup/delete-popup.component';
import {Usertype} from '../../models/usertype.enum';
import {ParticipantService} from '../../services/participant/participant-service';
import {FfqParticipant} from '../../models/ffq-participant';
import {ResearchInstitutionService} from '../../services/research-institution-service/research-institution-service';
import {FFQResearchInstitution} from '../../models/ffq-research-institution';
import {environment} from '../../../environments/environment';
import {FFQResearcher} from '../../models/ffqresearcher';
import {ResearchService} from '../../services/research/research-service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  isNew: boolean;
  isUpdate: boolean;
  private createParents: boolean;
  private createClinician: boolean;
  private createResearcher: boolean;
  showMsg = false;
  selectedClinic: string;
  selectedClinician: string;
  cliniciansLimit: number;
  parentsLimit: number;
  numClinician: number;
  numParents: number;
  parentLimitForClinician: number;
  prefix: string;
  able2AddClinicians: number;
  able2AddParents: number;
  userTypes = Usertype;
  ffqParent: FFQParent;
  ffqclinician: FFQClinician;
  public ffqclinicList$: Observable<FFQClinic[]>;
  public ffqclinicianList$: Observable<FFQClinician[]>;
  usersQuantity = 1;
  userId: string;
  noUsers: boolean;
  suffix;
  found: boolean;
  newPrefix: boolean;
  max = 0;
  newNumber: number;
  toStrip: string;
  userPassword: string;
  dissabled = false;
  clinicianName: string;
  clinicName: string;
  newClinicians = [];
  data = [];
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: true,
    title: 'Clinician Login',
    titles: 'User Info',
    useBom: false,
    removeNewLines: true,
    keys: ['userName', 'password' ]
  };
  userType: Usertype;

  constructor(
    public researcherService: ResearchService,
    private parentService: ParentService,
    private participantService: ParticipantService,
    private researchInstitutionService: ResearchInstitutionService,
    public clinicianService: ClinicianService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public clinicService: ClinicService,

    private modalService: NgbModal


  ) {
    this.ffqclinicList$ = this.clinicService.getAllClinics();
    this.ffqclinicianList$ = this.clinicianService.getAllClinicians();

  }

  userAttributes: FFQClinician | FFQParent | FfqParticipant;
  dataLoaded: Promise<boolean>;

  // ffqclinician: FFQClinician;
  amountToAdd: number;
  isProcessing: boolean;
  public ffqresearcherList: FFQResearcher[] = [];
  public ffqclinicList: FFQClinic[] = [];
  public researchInstitutionList: FFQResearchInstitution[] = [];
  public ffqclinicianList: FFQClinician[] = [];
  public ffqparentList: FFQParent[] = [];
  clinicNames: string[] = [];
  clinicIds: Map<string, string> = new Map<string, string>();
  clinicId: string;
  get backToListLink(): string {
    return this.isParticipant ?
      environment.routes.adminResearchUsersRoute :
      environment.routes.adminUserRoute;
  }

  ngOnInit() {

    this.isProcessing = false;
    this.createParents = false;
    this.createClinician = false;
    this.createResearcher = false;
    this.clinicNames.push('');

    this.userType = Usertype[this.route.snapshot.paramMap.get('type')];
    const UserID = this.route.snapshot.paramMap.get('id');

    if (UserID === 'new')
    {
      this.isNew = true;
      this.dataLoaded = Promise.resolve(true);
    }
    else
    {
      this.isUpdate = true;
      if (this.userType === Usertype.parent)
      {
        this.getParentByID(UserID);
      }
        else if (this.userType === Usertype.participant)
      {
        this.getParticipantByID(UserID);
      }
        else
      {
        this.getClinicianByID(UserID);
      }
    }

    const clinicListObservable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    clinicListObservable.subscribe(clinicList => {
      this.ffqclinicList = clinicList;
      clinicList.forEach(clinic => {
        this.clinicIds.set(clinic.clinicname, clinic.clinicId);
        this.clinicNames.push(clinic.clinicname);
      });
    });

    this.researchInstitutionService.getAllResearchInstitutions().subscribe(researchInstitutions => {
      this.researchInstitutionList = researchInstitutions;
    });

    const parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();
    parentList.subscribe(a => {
      this.ffqparentList = a;
    });

    const clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();
    clinicianList.subscribe(a => {
      this.ffqclinicianList = a;
    });

    const researchList: Observable<FFQResearcher[]> = this.researcherService.getAllUsers();
    researchList.subscribe(a => {
      this.ffqresearcherList = a;
    });
  }

  selectChangeHandler(event: any)
  {
    this.numClinician = 0;
    this.numParents = 0;
    this.able2AddClinicians = 0;
    this.able2AddParents = 0;
    this.clinicId = event.value;
    for (const item of this.ffqclinicList) {
      if (this.clinicId === item.clinicId)
      {
        this.cliniciansLimit = item.cliniciansLimit;
        this.parentsLimit = item.parentsLimit;
        this.clinicName = item.clinicname;
      }
    }

    this.ffqclinicianList.forEach(item => {
      if (this.clinicId === item.assignedclinic){
        this.numClinician += 1;
      }
    });

    this.ffqparentList.forEach(item => {
      if (this.clinicId === item.assignedclinic){
        this.numParents += 1;
      }
    });
    if ((this.cliniciansLimit === 0) || (this.numClinician > this.cliniciansLimit) ){
      this.able2AddClinicians = 0;
    }
    else{
      this.able2AddClinicians = this.cliniciansLimit - this.numClinician;
    }
    if (this.parentsLimit === 0){
      this.able2AddParents = 0;
    }
    else{
      this.able2AddParents = this.parentsLimit - this.numParents;
    }
  }

  addUser() {

    switch (this.userType) {
      case Usertype.clinician: {
        if (this.usersQuantity === 1) {
          this.addClinician();
        } else {
          this.addMultipleClinicians();
        }
        break;
      }
      case Usertype.parent: {
        console.log(this.selectedClinician);
        if (this.usersQuantity === 1) {
          if (this.selectedClinician === undefined){
            this.addParent();
          }else{
            this.addParent2AssignCli();
          }

        } else {
          if (this.selectedClinician === undefined){
            this.addMultipleParents();
          }else{
            this.addMultipleParents2assign();
          }
          console.log('adding multiple clinicians');
        }
        break;
      }
    }
  }
  dataLoop(){
    for (let i = 0; i < 6; i++){
      this.data[i] = [
        {
          userName: '',
          password: ''
        },
      ];
    }
  }
  save2csvSingleClinician() {
    this.dataLoop();
    this.data[0].userName = 'Assingned clinic: ';
    this.data[0].password = this.clinicName;
    this.data[1].userName = 'Assingned clinic ID: ';
    this.data[1].password = this.selectedClinic;
    this.data[2].userName = '';
    this.data[2].password = '';
    this.data[3].userName = 'User Name';
    this.data[3].password = 'Password';
    this.data[4].userName = '';
    this.data[4].password = '';
    this.data[5].userName = this.clinicianName;
    this.data[5].password = this.userPassword;
  }
  userNameCreator() {
    this.prefix = this.prefix.replace(/\s/g, '');
    let prefixInClinic = true;
    for (let i = 0; i <= this.ffqclinicianList.length - 1; i++){
      if (this.prefix === this.ffqclinicianList[i].prefix && this.ffqclinicianList[i].assignedclinic === this.selectedClinic){
        this.toStrip = this.prefix + '_Clinician';
        this.newNumber = parseInt(this.ffqclinicianList[i].username.replace(this.toStrip, ''), 10);
        if (this.newNumber > this.max){
          this.max = this.newNumber;
        }
        this.newPrefix = false;
      }
      else if (this.ffqclinicianList[i].assignedclinic !== this.selectedClinic && this.prefix === this.ffqclinicianList[i].prefix) {
        this.found = true;
        break;
      }
      else if (prefixInClinic) {
        if (this.ffqresearcherList.some(researcher => researcher.prefix === this.prefix)) {
          this.found = true;
          break;
        }
        prefixInClinic = false;
      }
      else if (this.ffqclinicianList.length - 1 === i && this.newPrefix === undefined){
        this.newPrefix = true;
        this.clinicianName = this.prefix + '_Clinician1';
        this.newNumber = 1;
        break;
      }
    }
  }
  addClinician() {
    this.generatePasswordCreation();
    if (this.ffqclinicianList.length === 0) {
      this.clinicianName = this.prefix + '_Clinician1';
      this.ffqclinician = new FFQClinician('', this.clinicianName, this.userPassword, '', '', '',
        this.selectedClinic, [], true, this.parentLimitForClinician, this.prefix);
      this.noUsers = true;
    }
    if (!this.noUsers) {
      this.userNameCreator();
      if (!this.found) {
        if (!this.newPrefix) {
          this.max++;
          this.clinicianName = this.toStrip.replace(/\s/g, '') + (this.max).toString();
        }
        this.ffqclinician = new FFQClinician('', this.clinicianName, this.userPassword, '', '', '',
          this.selectedClinic, [], true, this.parentLimitForClinician, this.prefix);
      }
    }
    if (!this.found || this.noUsers) {
      this.clinicianService.addClinician(this.ffqclinician).subscribe(clinician => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = clinician.username + ' was added!';
          this.save2csvSingleClinician();
          this.dissabled = true;
        },
        error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
        });
      this.isProcessing = false;
    }
    if (this.found) {
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      this.router.navigateByUrl('/admin/users');
      dialogRef.componentInstance.title = 'This prefix is already in use by another Clinic <br> or Research Institution';
    }
  }

  dataLoopMultiple() {
    for (let i = 0; i < this.newClinicians.length + 5; i++) {
      this.data[i] = [
        {
          userName: '',
          password: ''
        },
      ];
    }
  }
  save2csvMultipleClinician() {
    this.dataLoopMultiple();
    this.data[0].userName = 'Assingned clinic: ';
    this.data[0].password = this.clinicName;
    this.data[1].userName = 'Assingned clinic ID: ';
    this.data[1].password = this.selectedClinic;
    this.data[2].userName = '';
    this.data[2].password = '';
    this.data[3].userName = 'User Name';
    this.data[3].password = 'Password';
    this.data[4].userName = '';
    this.data[4].password = '';

    for (let i = 0; i < this.newClinicians.length; i++){
      this.data[i + 5].userName = this.newClinicians[i].username;
      this.data[i + 5].password = this.newClinicians[i].userpassword;
    }
  }

  addMultipleClinicians() {
    if (this.ffqclinicianList.length === 0) {
      this.clinicianName = this.prefix + '_Clinician1';
      this.toStrip = this.prefix + '_Clinician';
      for (let i = 0; i < this.usersQuantity; i++) {
        this.generatePasswordCreation();
        this.newClinicians.push(new FFQClinician('', this.clinicianName, this.userPassword, '', '',
          '', this.selectedClinic, [], true, this.parentLimitForClinician, this.prefix));
        this.newNumber = parseInt(this.clinicianName.replace(this.toStrip, ''), 10) + 1;
        this.clinicianName = this.toStrip + this.newNumber.toString();
      }
      this.noUsers = true;
    }
    if (!this.noUsers) {
      this.userNameCreator();
      if (!this.found) {
        for (let i = 0; i < this.usersQuantity; i++) {
          if (!this.newPrefix) {
            this.max += 1;
            this.clinicianName = this.toStrip + (this.max).toString();
          }
          if (this.newPrefix) {
            if (this.newNumber >= 2) {
              this.toStrip = this.prefix + '_Clinician';
              this.newNumber = parseInt(this.clinicianName.replace(this.toStrip, ''), 10) + 1;
              this.clinicianName = this.toStrip + (this.newNumber).toString();
            }
            this.newNumber += 1;
          }
          this.generatePasswordCreation();
          this.newClinicians.push(new FFQClinician('', this.clinicianName, this.userPassword, '', '',
            '', this.selectedClinic, [], true, this.parentLimitForClinician, this.prefix));
        }
      }
    }
    if (!this.found || this.noUsers) {
      this.clinicianService.addMultipleClinicians(this.newClinicians).subscribe(clinicians => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = clinicians.map(clinician => clinician.username).join('<br/>') + '<br/>were added!';
          this.save2csvMultipleClinician();
          this.dissabled = true;
        },
        error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
        });
    }
    if (this.found) {
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      this.router.navigateByUrl('/admin/users');
      dialogRef.componentInstance.title = 'This prefix is already in use by another Clinic <br> or Research Institution';
    }
  }

  addParent() {
    this.ffqParent = new FFQParent('', '', '', 'parent', '', '',
      this.selectedClinic, '', [''], true, this.prefix, '', 0, []);
    console.log(this.ffqParent);

    this.parentService.addParent(this.ffqParent).subscribe(parent => {
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        // this.router.navigateByUrl('/admin/user/new');
        dialogRef.componentInstance.title = parent.username + ' was added!';
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
      });
  }

  addParent2AssignCli() {
    this.ffqParent = new FFQParent('', '', '', 'parent', '', '',
      this.selectedClinic, this.selectedClinician, [''], true, this.prefix, '', 0, []);
    console.log(this.ffqParent);

    this.parentService.addParent(this.ffqParent).subscribe(parent => {
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        // this.router.navigateByUrl('/admin/user/new');
        dialogRef.componentInstance.title = parent.username + ' was added!';
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
      });
  }

  addMultipleParents() {
    const newParents = [];
    for (let i = 0; i < this.usersQuantity; i++) {
      newParents.push(new FFQParent('', '', '', 'parent', '', '',
        this.selectedClinic, '', [''], true, this.prefix, '', 0, []));
    }

    this.parentService.addMultipleParents(newParents).subscribe(clinicians => {
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = clinicians.map(clinician => clinician.username).join('<br/>') + '<br/>were added!';
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
      });
  }

  addMultipleParents2assign() {
    const newParents = [];
    for (let i = 0; i < this.usersQuantity; i++) {
      newParents.push(new FFQParent('', '', '', 'parent', '', '',
        this.selectedClinic, this.selectedClinician, [''], true, this.prefix, '', 0, []));
    }

    this.parentService.addMultipleParents(newParents).subscribe(clinicians => {
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = clinicians.map(clinician => clinician.username).join('<br/>') + '<br/>were added!';
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
      });
  }


  getParentByID(id: string)
  {
    this.parentService.getParent(id).subscribe(data => {
      this.userAttributes = data;
    });
    this.dataLoaded = Promise.resolve(true);
  }

  getParticipantByID(id: string)
  {
    this.participantService.getParticipant(id).subscribe(data => {
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
    if (this.isParent)
    {
      this.updateParent();
    }
    else if (this.isParticipant)
    {
      this.updateParticipant();
    }
    else
    {
      this.updateClinician();
    }
  }

  updateParent()
  {
    this.parentService.updateParent(this.userAttributes as FFQParentResponse).subscribe(
      data => {this.router.navigateByUrl('/admin/users');
               const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
               dialogRef.componentInstance.title = 'Parent successfully updated!'; }
    );
  }

  updateParticipant()
  {
    this.participantService.updateParticipant(this.userAttributes as FfqParticipant).subscribe(
      data => {this.router.navigateByUrl(environment.routes.adminResearchUsersRoute);
               const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
               dialogRef.componentInstance.title = 'Participant successfully updated!'; }
    );
  }

  updateClinician()
  {
    this.clinicianService.updateClinician(this.userAttributes as FFQClinicianResponse)
      .subscribe( data => {
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = 'Clinician successfully updated!';
      });
  }


  deleteUser(){
    if (this.isParent)
    {
      this.deleteParent();
    }
    else if (this.isParticipant)
    {
      this.deleteParticipant();
    }
    else
    {
      this.deleteClinician();
    }
  }

  deleteParent(){
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = 'Parent';
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }

  deleteParticipant(){
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = 'Participant';
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }

  deleteClinician(){
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = 'Clinician';
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }

  generatePasswordCreation() {
    this.userPassword = Math.random().toString(36).slice(-10);
  }
  generatePassword() {
    this.userAttributes.userpassword = Math.random().toString(36).slice(-10);
  }

  get isParent() {
    return this.userType === Usertype.parent;
  }
  get isClinician() {
    return this.userType === Usertype.clinician;
  }
  get isParticipant() {
    return this.userType === Usertype.participant;
  }
}
