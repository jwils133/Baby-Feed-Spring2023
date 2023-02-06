import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {NgForm} from '@angular/forms';
import {Observable} from 'rxjs';
import {ResearchInstitutionService} from 'src/app/services/research-institution-service/research-institution-service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeletePopupComponent} from "src/app/components/delete-popup/delete-popup.component";
import { FFQResearchInstitution } from "src/app/models/ffq-research-institution";
import { FFQInstitution } from 'src/app/models/ffqinstitution';


@Component({
  selector: 'app-modify-research-institution',
  templateUrl: './modify-research-institution.component.html',
  styleUrls: ['./modify-research-institution.component.css']
})
export class UpdateResearchInstitutionComponent implements OnInit, OnDestroy {

  name_of_research_institution: string;
  id_of_research_institution: string;
  location: string;
  private subscriptions = [];
  dataLoaded: Promise<boolean>;
  public selectedResearchInstitution:FFQResearchInstitution;
  researchInstitutionAttributes: FFQInstitution;


  constructor(
    private researchInstitutionService: ResearchInstitutionService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    const UserID = this.route.snapshot.paramMap.get('id');

    var researchInstitutionResult: Observable<FFQResearchInstitution> = this.researchInstitutionService.getResearchInstitution(UserID);

    researchInstitutionResult.subscribe(data => {

      this.selectedResearchInstitution = data;

      this.researchInstitutionAttributes = this.selectedResearchInstitution;
      this.id_of_research_institution = this.selectedResearchInstitution.researchInstitutionId;
      this.name_of_research_institution = this.selectedResearchInstitution.institutionName;
      this.location = this.selectedResearchInstitution.address;

      if(data != null)
      {
        this.dataLoaded = Promise.resolve(true);
      }


    })



  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }



  updateResearchInstitution() {

    this.researchInstitutionService.updateUser(<FFQResearchInstitution>this.researchInstitutionAttributes).subscribe(
      data => {
        this.router.navigateByUrl("/admin/research/users");
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = 'Research Institution successfully updated!';
      }
    );
  }

  deleteResearchInstitution() {
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = "Research-institution";
    confirmDelete.componentInstance.attributes = this.researchInstitutionAttributes;
  }
}




