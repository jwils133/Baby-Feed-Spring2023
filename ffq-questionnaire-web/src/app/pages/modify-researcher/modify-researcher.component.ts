import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {Observable} from 'rxjs';
import {ResearchService} from 'src/app/services/research/research-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeletePopupComponent} from 'src/app/components/delete-popup/delete-popup.component';
import { FFQResearcher } from 'src/app/models/ffqresearcher';
import { FFQResearchInstitution } from 'src/app/models/ffq-research-institution';
import { ResearchInstitutionService } from 'src/app/services/research-institution-service/research-institution-service';


@Component({
  selector: 'app-modify-researcher',
  templateUrl: './modify-researcher.component.html',
  styleUrls: ['./modify-researcher.component.css']
})
export class UpdateResearcherComponent implements OnInit {

  dataLoaded: Promise<boolean>;
  public selectedResearcher: FFQResearcher;
  researchAttributes: FFQResearcher;
  userPassword: string;
  limitNumberOfParticipants: number;
  AssignedResearchInstitutionName: string;
  assignedResearchInstitutionId: string;
  researchInstitutionList: FFQResearchInstitution[];

  constructor(
    private researcherService: ResearchService,
    private researchInstitutionService: ResearchInstitutionService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    const UserID = this.route.snapshot.paramMap.get('id');

    let researcherResult: Observable<FFQResearcher> = this.researcherService.getUserById(UserID);

    researcherResult.subscribe(data => {

      this.selectedResearcher = data;
      this.researchAttributes = this.selectedResearcher;
      this.userPassword = this.researchAttributes.userpassword;

      let chosenResearchInstName: Observable<FFQResearchInstitution> = this.researchInstitutionService.getResearchInstitution(this.researchAttributes.assignedResearchInstitutionId);

      chosenResearchInstName.subscribe (inst => {
        this.AssignedResearchInstitutionName = inst.institutionName;
      });
      let researchInstitutionList: Observable<FFQResearchInstitution[]> = this.researchInstitutionService.getAllResearchInstitutions();
      researchInstitutionList.subscribe(a => {
      this.researchInstitutionList = a;

      if (data != null && a != null)
      {
        this.dataLoaded = Promise.resolve(true);
      }
    });

    });

  }


  updateResearchInstitution() {

    let chosenResearchInstName: Observable<FFQResearchInstitution> = this.researchInstitutionService.getResearchInstitutionByName(this.AssignedResearchInstitutionName);

    chosenResearchInstName.subscribe(inst => {
      this.researchAttributes.assignedResearchInstitutionId = inst.researchInstitutionId;

      this.researcherService.updateUser(this.researchAttributes as FFQResearcher).subscribe(
        data => {
          this.router.navigateByUrl('/admin/research/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = 'Researcher was successfully updated!';
        }
      );

    });


  }

  deleteResearcher() {
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = 'Researcher';
    confirmDelete.componentInstance.attributes = this.researchAttributes;
  }

  generatePassword() {
    this.userPassword = Math.random().toString(36).slice(-10);
    this.researchAttributes.userpassword =  this.userPassword;
  }
}




