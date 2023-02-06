
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';
import { ResearchInstitutionService } from 'src/app/services/research-institution-service/research-institution-service';
import {FFQResearcher} from 'src/app/models/ffqresearcher';
import { ResearchService } from 'src/app/services/research/research-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeletePopupComponent } from 'src/app/components/delete-popup/delete-popup.component';
import { FFQResearchInstitution } from 'src/app/models/ffq-research-institution';


@Component({
  selector: 'app-research-institution',
  templateUrl: './research-institution.component.html',
  styleUrls: ['./research-institution.component.css']
})
export class ResearchInstitutionComponent implements OnInit {

  private routeSub: Subscription;
  private isNew: boolean;
  private isUpdate: boolean;
  showMsg = false;
  institutionName: string;
  location: string;
  resultObjectList: Object[] = [];
  participantsLimit: number;
  lastItem: string;

  constructor(
    public researcherService: ResearchService,
    public researchInstitutionService: ResearchInstitutionService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal

    ) { }


  researcher: FFQResearcher[] = [];
  researchInstitutionAttributes: object;
  dataLoaded: Promise<boolean>;
  ffqinsitution: FFQResearchInstitution;
  public ffqresearcherList: FFQResearcher[] = [];
  public ffqresearchInstList: FFQResearchInstitution[] = [];
  researcherNames: string[] = [];

  ngOnInit() {

   }

  addResearchInstitution(form: NgForm){
    console.log('this is the limit = ' + this.participantsLimit);
    const todayDate = new Date();
    const dd = String(todayDate.getDate()).padStart(2, '0');
    const mm = String(todayDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = todayDate.getFullYear();
    const today = mm + '/' + dd + '/' + yyyy;


    const researchInstitutionList: Observable<FFQResearchInstitution[]> = this.researchInstitutionService.getAllResearchInstitutions();

    researchInstitutionList.subscribe(data => {

      if (data.length === 0){
       this.lastItem = '0';
     }else {
        this.lastItem = data[data.length - 1].researchInstitutionId;
      }


      const newResearchInstId = (parseInt(this.lastItem, 10) + 1).toString();


      console.log(newResearchInstId, this.location, today,
                this.institutionName);

      this.ffqinsitution = new FFQResearchInstitution(newResearchInstId, this.location, today,
                this.institutionName, 'researchInstitution', this.participantsLimit);

      console.log(this.ffqinsitution);

      this.researchInstitutionService.addUser(this.ffqinsitution).subscribe(data => {
          this.router.navigateByUrl('/admin/research/users');
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = 'Research Institution: "' + this.ffqinsitution.institutionName + '" was added!';
      },
      error => {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
      });

    });
}

  private getResearchInstById(id: string)
  {
      this.researchInstitutionService.getResearchInstitution(id).subscribe(data => {
       this.researchInstitutionAttributes = data;
      });
      this.dataLoaded = Promise.resolve(true);
  }



  updateResearchInstitution()
  {
    this.researchInstitutionService.updateUser(this.ffqinsitution as FFQResearchInstitution).subscribe(
     data => {this.router.navigateByUrl('admin/research/users');
              const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
              dialogRef.componentInstance.title = 'Research Institution successfully updated!'; }

    );
  }

  deleteResearchInstitution(){
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = 'research_institution';
    confirmDelete.componentInstance.attributes = this.researchInstitutionAttributes;
  }
}




