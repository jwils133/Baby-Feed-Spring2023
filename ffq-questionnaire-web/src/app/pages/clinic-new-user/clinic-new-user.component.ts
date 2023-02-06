import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {Subscription} from 'rxjs/internal/Subscription';
import {combineLatest, Observable} from 'rxjs';
import {ParentService} from 'src/app/services/parent/parent-service';
import {ClinicianService} from 'src/app/services/clinician/clinician-service';
import {FFQParent} from 'src/app/models/ffqparent';
import {FFQClinician} from 'src/app/models/ffqclinician';
import {ClinicService} from 'src/app/services/clinic/clinic-service';
import {FFQClinic} from 'src/app/models/ffqclinic';
import {Usertype} from '../../models/usertype.enum';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {User} from '../../models/user';
import {skipWhile, take} from 'rxjs/operators';
import {FFQParentResponse} from '../../models/ffqparent-response';
import {FFQClinicResponse} from '../../models/ffqclinic-response';

// hello

@Component({
  selector: 'app-clinic-new-user',
  templateUrl: './clinic-new-user.component.html',
  styleUrls: ['./clinic-new-user.component.css']
})
export class ClinicNewUserComponent implements OnInit {
  loggedInUser = this.authenticationService.currentUserValue;
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: true,
    title: 'User Info',
    titles: 'User Info',
    useBom: false,
    removeNewLines: true,
    keys: ['userName', 'password']
  };
  data = [];
  selectedClinic: FFQClinic;
  userType
  userTypes = Usertype;
  ffqParent: FFQParent;
  ffqclinicList$: Observable<FFQClinic[]>;
  usersQuantity = 1;
  currentUser$: Observable<FFQClinician[]>;
  private parentLimitForClinician: number;
  currentUser: Observable<FFQClinician[]>;
  clicked = false;
  noMoreRoom = false;
  // limit = this.loggedInUser[0].parentLimitForClinician;
  limit = 0;
  numParents = 0;
  newLimit = 0;
  prefix = this.loggedInUser[0].prefix;
  lastUserId;
  suffix;
  userPassword;
  dissabled = false;
  intialLoad = true;
  initial = true;
  testing = [];
  newParents = [];
  loggedInCliName;
  parentName: string;
  toStrip: string;
  max = 0;
  newNumber: number;
  notFound = true;
  noUsers: boolean;
  loggedinClinic: Observable<FFQClinicResponse>;

  constructor(
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    private errorDialog: MatDialog,
    private router: Router,
    public clinicService: ClinicService,
    private authenticationService: AuthenticationService
  ) {
    this.ffqclinicList$ = this.clinicService.getAllClinics();
    this.currentUser$ = this.authenticationService.currentUser as unknown as Observable<FFQClinician[]>;
    this.currentUser = this.currentUser$;
  }

  numberOfPatients: number[] = [];
  ffqparentList: FFQParent[] = [];
  ffqclinicList: FFQClinic[] = [];


  ngOnInit() {
    combineLatest([this.currentUser$, this.ffqclinicList$]).pipe(
      skipWhile(([users, clinics]) => users.length === 0 || clinics.length === 0),
      take(1))
      .subscribe(([user, clinics]) => {
        this.selectedClinic = clinics.find(c => c.clinicId === user[0].assignedclinic);


      });

    const parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();
    parentList.subscribe(a => {
      this.ffqparentList = a;
    });

    const clinList: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    clinList.subscribe(a => {
      this.ffqclinicList = a;
    });
  }

  getCliName() {
    for (const item of this.ffqclinicList) {
      if (this.loggedInUser[0].assignedclinic === item.clinicId) {
        this.loggedInCliName = item.clinicname;
      }
    }

  }

  countParents() {
    this.userType = Usertype.parent
    for (let i = 0; i < this.ffqclinicList.length; i++) {
      if (this.loggedInUser[0].assignedclinic === this.ffqclinicList[i].clinicId) {
        this.limit = this.ffqclinicList[i].parentsLimit;
      }
    }

    for (let i = 0; i < this.ffqparentList.length; i++) {
      if (this.loggedInUser[0].assignedclinic === this.ffqparentList[i].assignedclinic) {
        this.numParents++;
      }
    }
    if (this.limit - this.numParents <= 0) {
      this.noMoreRoom = true;
    }
    this.newLimit = this.limit - this.numParents;
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
        if (this.usersQuantity === 1) {
          this.addParent();
        } else {
          this.addMultipleParents();
        }
        break;
      }
    }
  }

  addClinician() {
    const ffqclinician = new FFQClinician('', '', '', '', '', '', this.selectedClinic.clinicId, [], true, this.parentLimitForClinician, this.prefix);

    this.clinicianService.addClinician(ffqclinician).subscribe(clinician => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = clinician.username + ' was added!';
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
      });
  }

  addMultipleClinicians() {
    const newClinicians = [];
    for (let i = 0; i < this.usersQuantity; i++) {
      newClinicians.push(new FFQClinician('', '', '', '', '', '',
        this.selectedClinic.clinicId, [], true, this.parentLimitForClinician, this.prefix));
    }

    this.clinicianService.addMultipleClinicians(newClinicians).subscribe(clinicians => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = 'Users<br/>' + clinicians.map(clinician => clinician.username).join('<br/>') + '<br/>were added!';
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
      });
  }

  getSuffix() {
    if (this.ffqparentList.length === 0) {
      this.suffix = 1;
    } else {
      this.lastUserId = this.ffqparentList[this.ffqparentList.length - 1].userId;
      this.suffix = parseInt(this.lastUserId, 10) + 1;
    }
  }

  addParent() {
    this.generatePassword();
    if (this.ffqparentList.length === 0) {
      this.parentName = this.prefix + '_1';
      this.ffqParent = new FFQParent('', this.parentName, this.userPassword, 'parent', '', '',
        this.selectedClinic.clinicId, this.loggedInUser[0].userId, [''], true, this.loggedInUser[0].prefix,
        // fix-bug: lastRead and times should be added to the data when a parent record is created.
        '', 0, []);
      this.noUsers = true;
    }
    if (!this.noUsers) {
      if (this.prefix === '') {
        this.prefix = 'parent';
        this.parentName = this.prefix.replace(/\s/g, '') + '_' + this.suffix.toString();
        this.ffqParent = new FFQParent('', '', this.userPassword, 'parent', '',
          '', this.selectedClinic.clinicId, this.loggedInUser[0].userId, [''], true, this.prefix,
          '', 0, []);
      } else {
        this.userNameCreator();
        this.ffqParent = new FFQParent('', this.parentName, this.userPassword, 'parent', '', '',
          this.selectedClinic.clinicId, this.loggedInUser[0].userId, [''], true, this.loggedInUser[0].prefix,
          '', 0, []);
      }
    }
    this.parentService.addParent(this.ffqParent).subscribe(parent => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = parent.username + ' was added!';
        this.save2csvSingleParent();
        this.dissabled = true;
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
        this.router.navigateByUrl('/clinic/home');
      });
  }

  dataLoop() {
    for (let i = 0; i < 7; i++) {
      this.data[i] = [
        {
          userName: '',
          password: ''
        },
      ];
    }
  }

  save2csvSingleParent() {
    this.getCliName();
    this.dataLoop();

    this.data[0].userName = 'Assingned clinic: ';
    this.data[0].password = this.loggedInCliName;
    this.data[1].userName = 'Assingned clinic ID: ';
    this.data[1].password = this.loggedInUser[0].assignedclinic;
    this.data[2].userName = 'Assingned clinician: ';
    this.data[2].password = this.loggedInUser[0].username;
    this.data[3].userName = '';
    this.data[3].password = '';
    this.data[4].userName = 'User Name';
    this.data[4].password = 'Password';
    this.data[5].userName = '';
    this.data[5].password = '';
    this.data[6].userName = this.parentName;
    this.data[6].password = this.userPassword;
  }

  dataLoopMultiple() {
    for (let i = 0; i < this.newParents.length + 6; i++) {
      this.data[i] = [
        {
          userName: '',
          password: ''
        },
      ];
    }
  }

  save2csvMultipleParent() {
    this.getCliName();
    this.dataLoopMultiple();
    this.data[0].userName = 'Assingned clinic: ';
    this.data[0].password = this.loggedInCliName;
    this.data[1].userName = 'Assingned clinic ID: ';
    this.data[1].password = this.loggedInUser[0].assignedclinic;
    this.data[2].userName = 'Assingned clinician: ';
    this.data[2].password = this.loggedInUser[0].username;
    this.data[3].userName = '';
    this.data[3].password = '';
    this.data[4].userName = 'User Name';
    this.data[4].password = 'Password';
    this.data[5].userName = '';
    this.data[5].password = '';

    for (let i = 0; i < this.newParents.length; i++) {
      this.data[i + 6].userName = this.newParents[i].username;
      this.data[i + 6].password = this.newParents[i].userpassword;
    }
  }

  userNameCreator() {
    for (let i = 0; i <= this.ffqparentList.length - 1; i++) {
      if (this.ffqparentList[i].assignedclinic ===
        this.loggedInUser[0].assignedclinic && this.ffqparentList[i].prefix === this.loggedInUser[0].prefix) {
        this.notFound = false;
        this.toStrip = this.prefix + '_';
        this.newNumber = parseInt(this.ffqparentList[i].username.replace(this.toStrip, ''), 10);

        if (this.newNumber > this.max) {
          this.max = this.newNumber;
        }
        this.parentName = this.prefix + '_' + (this.max + 1).toString();
      }
      if (this.ffqparentList.length - 1 === i && this.notFound) {
        // multiple parents added
        this.toStrip = this.prefix + '_';
        // one parent added
        this.parentName = this.prefix + '_1';
      }
    }
  }

  addMultipleParents() {
    if (this.usersQuantity <= this.newLimit) {
      if (this.ffqparentList.length === 0) {
        this.parentName = this.prefix + '_1';
        this.toStrip = this.prefix + '_';
        for (let i = 0; i < this.usersQuantity; i++) {
          this.generatePassword();

          this.newParents.push(new FFQParent('', this.parentName, this.userPassword, 'parent', '',
            '', this.selectedClinic.clinicId, this.loggedInUser[0].userId, [''], true, this.prefix,
            '', 0, []));
          this.newNumber = parseInt(this.parentName.replace(this.toStrip, ''), 10) + 1;
          this.parentName = this.toStrip + this.newNumber.toString();
        }
        this.noUsers = true;
      }
      if (!this.noUsers) {
        if (this.prefix === '') {
          for (let i = 0; i < this.usersQuantity; i++) {
            this.prefix = 'parent';
            this.generatePassword();
            this.newParents.push(new FFQParent('', this.parentName, this.userPassword, 'parent', '',
              '', this.selectedClinic.clinicId, this.loggedInUser[0].userId, [''], true, this.prefix,
              '', 0, []));
            this.suffix++;
          }
        } else {
          this.userNameCreator();
          for (let i = 0; i < this.usersQuantity; i++) {
            this.generatePassword();

            this.newParents.push(new FFQParent('', this.parentName, this.userPassword, 'parent', '',
              '', this.selectedClinic.clinicId, this.loggedInUser[0].userId, [''], true, this.prefix,
              '', 0, []));
            this.newNumber = parseInt(this.parentName.replace(this.toStrip, ''), 10) + 1;
            this.parentName = this.toStrip + this.newNumber.toString();
          }
        }
      }

      this.parentService.addMultipleParents(this.newParents).subscribe(clinicians => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = 'Users<br/>' + clinicians.map(clinician => clinician.username).join('<br/>') + '<br/>were added!';
          console.log(this.newParents[0].username);
          this.save2csvMultipleParent();
          this.dissabled = true;
        },
        error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
          this.router.navigateByUrl('/clinic/home');
        });
    } else {
      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = '<center>Cannot add more Parents than allowed limit<br/> ' +
        'Contact admin if this is an error or to increase limit<br/></center>';
    }
  }

  generatePassword() {
    this.userPassword = Math.random().toString(36).slice(-10);
  }
}
