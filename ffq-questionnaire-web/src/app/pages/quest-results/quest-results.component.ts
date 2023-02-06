import {Component, OnInit} from '@angular/core';
import {ResultsService} from 'src/app/services/results/results.service';
import {FFQResultsResponse} from 'src/app/models/ffqresultsresponse';
import {Observable} from 'rxjs';
import {NutrientConstants} from 'src/app/models/NutrientConstants';


/////////// added imports from recommend.component.ts/////////////////////
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RecommendModalComponent} from 'src/app/components/recommend-modal/recommend-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {NutrientsRecommendationsService} from 'src/app/services/nutrients-recommendations/nutrients-recommendations.service';
import {ErrorDialogPopupComponent} from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import {Router} from '@angular/router';
import {FoodRecommendModalComponent} from 'src/app/components/food-recommend-modal/food-recommend-modal.component';
import {FoodRecommendationsService} from 'src/app/services/food-recommendation-service/food-recommendations.service';
import {FoodDescriptionService} from 'src/app/services/food-description/food-description.service';
import {DeletePopupComponent} from '../../components/delete-popup/delete-popup.component';
import {ExportService} from '../../services/export/export-service';
import {FFQFoodRecommendations} from '../../models/ffqfood-recommendations';
import {FFQClinic} from '../../models/ffqclinic';
import {ClinicService} from 'src/app/services/clinic/clinic-service';
import {FFQParent} from '../../models/ffqparent';
import {ParentService} from '../../services/parent/parent-service';
import {FFQParentResponse} from '../../models/ffqparent-response';
import {FfqParticipant} from '../../models/ffq-participant';
import {ParticipantService} from '../../services/participant/participant-service';
import {FFQResearchInstitution} from '../../models/ffq-research-institution';
import {ResearchInstitutionService} from '../../services/research-institution-service/research-institution-service';
import {FFQClinicResponse} from '../../models/ffqclinic-response';
import {FFQInstitution} from '../../models/ffqinstitution';

// Questionnaire reesults page added by Daykel Muro 09/30/2019
@Component({
  selector: 'app-quest-results',
  templateUrl: './quest-results.component.html',
  styleUrls: ['./quest-results.component.css']
})
export class QuestResultsComponent implements OnInit {
  public show = false;
  public showFeedback = false;
  breastMilkFlag = [];
  results: FFQResultsResponse[] = [];
  parentResults: FFQResultsResponse[] = [];
  parentResultsByClinicId: FFQResultsResponse[] = [];
  participantResults: FFQResultsResponse[] = [];
  participantResultsByClinicId: FFQResultsResponse[] = [];
  questionnaireId: string;
  showParent = false;
  bySite = true;
  byClinic = true;
  showParticipant = false;
  selectedClinic: string;
  selectedSite: string;
  public ffqclinicList$: Observable<FFQClinic[]>;
  public ffqSiteList$: Observable<FFQResearchInstitution[]>;
  clinicId: string;
  public ffqparentList: FFQParent[] = [];
  public ffqParticipantList: FfqParticipant[] = [];
  showByClinic = true;
  showBySite = true;
  private clinic = [];
  private site = [];
  clinicAttributes: FFQClinic;
  siteAttributes: FFQInstitution;

  constructor(public resultsService: ResultsService, ////////////////////////////////////////
              public nutrientsRecommendationsService: NutrientsRecommendationsService,
              public foodRecommendationsService: FoodRecommendationsService,
              private parentService: ParentService,
              private participantService: ParticipantService,
              public foodDescriptionService: FoodDescriptionService,
              private modalService: NgbModal,
              public clinicService: ClinicService,
              public researchInstitutionService: ResearchInstitutionService,
              private errorDialog: MatDialog,
              private router: Router,
              private exportService: ExportService
  ) {
    this.ffqclinicList$ = this.clinicService.getAllClinics();
    this.ffqSiteList$ = this.researchInstitutionService.getAllResearchInstitutions();
  }

  ngOnInit() {
    const parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();
    parentList.subscribe(a => {
      this.ffqparentList = a;
    });

    const participantList: Observable<FfqParticipant[]> = this.participantService.getAllParticipants();
    participantList.subscribe(a => {
      this.ffqParticipantList = a;
    });

    this.getAllResults();
  }

  // (Khalid)Changed below code to sort the list in the nutient view page
  private getAllResults() {
    const oldList: Observable<FFQResultsResponse[]> = this.resultsService.getAllResults();
    const reqList: string[] = NutrientConstants.NUTRIENT_NAMES;

    oldList.subscribe(m => {

        m.forEach(element => {
          // console.log('element', element, element.questionnaireId);
          // set breastMilkFlag for food-recommend-model
          // if there is breast milk for the baby, then set flag to true
          if (element.userChoices.length > 0) {
            if (element.userChoices[0].name === 'Breast milk') {
              this.breastMilkFlag.push(element.questionnaireId);
            }
          }
          // console.log('breastMilkFlag', this.breastMilkFlag);
          const newWeeklyMap = new Map<string, number>();
          const newDailyMap = new Map<string, number>();
          const weeklyMap = element.weeklyTotals;
          const dailyMap = element.dailyAverages;

          reqList.forEach(a => {
            if (dailyMap[a]) {
              newDailyMap.set(a, dailyMap[a]);
            }
            else {
              newDailyMap.set(a, 0);
            }
            if (weeklyMap[a]) {
              newWeeklyMap.set(a, weeklyMap[a]);
            }
            else {
              newWeeklyMap.set(a, 0);
            }

          });

          element.weeklyTotals = newWeeklyMap;
          element.dailyAverages = newDailyMap;
        });

        this.results = m.reverse();
        this.parentResults = this.results.filter(t => t.userType === 'parent').map(result => ({
          ...result,
          username: this.getParentUsernameById(result.userId)
        }));
        this.participantResults = this.results.filter(t => t.userType === 'participant');
        this.setFoodList();
      }
    );
  }

  sortByClinic(event: any) {
    this.clinic.push(this.clinicService.getClinic(event.value).subscribe(data => {
      this.clinicAttributes = data;
    }));

    // manually adding assignedClinicOrSite id field to result since it doesn't get added when parent takes ffq
    for (let i = 0; i <= this.ffqparentList.length - 1; i++) {
      for (let j = 0; j <= this.parentResults.length - 1; j++) {
        if (this.parentResults[j].userId === this.ffqparentList[i].userId) {
          this.parentResults[j].assignedClinicOrSiteId = this.ffqparentList[i].assignedclinic;
        }
      }
    }
    // TO-DO create assignedClinicOrSite id field to result when a parent takes a questionnaire
    // will then be able to remove nested for loop and just filter by assignedClinicOrSite id
    this.parentResultsByClinicId = this.parentResults.filter(t => t.assignedClinicOrSiteId === event.value);

    const matSelect: any = event.source;
    matSelect.writeValue(null);
  }

  sortBySite(event: any) {
    this.site.push(this.researchInstitutionService.getResearchInstitution(event.value).subscribe(data => {
      this.siteAttributes = data;
    }));

    // manually adding assignedClinicOrSite id field to result since it doesn't get added when participant takes ffq
    for (let i = 0; i <= this.ffqParticipantList.length - 1; i++) {
      for (let j = 0; j <= this.participantResults.length - 1; j++) {
        if (this.participantResults[j].userId === this.ffqParticipantList[i].userId) {
          this.participantResults[j].assignedClinicOrSiteId = this.ffqParticipantList[i].assignedResearcherInst;
        }
      }
    }
    // TO-DO create assignedClinicOrSite id field to result when a participant takes a questionnaire
    // will then be able to remove nested for loop and just filter by assignedClinicOrSite id
    this.participantResultsByClinicId = this.participantResults.filter(t => t.assignedClinicOrSiteId === event.value);

    const matSelect: any = event.source;
    matSelect.writeValue(null);
  }

  deleteQuestionnaire(questionnaireId: string) {
    for (const item of this.results) {
      if (item.questionnaireId === questionnaireId) {
        const confirmDelete = this.modalService.open(DeletePopupComponent);
        confirmDelete.componentInstance.service = 'Questionnaire';
        confirmDelete.componentInstance.attributes = item;
        break;
      }
    }
  }

  private returnZero() {
    return 0;
  }

  toggleParentResults(index) {
    this.parentResults[index].show = !this.parentResults[index].show;
  }

  toggleParticipantResults(index) {
    this.participantResults[index].show = !this.participantResults[index].show;
  }

  /////////////////////////////////////////////////////////////////////////////////
  // (Francis) attempting to add Nutrients and Food Items buttons from recommend tab
  //            copy/pasted from recommend.component.ts
  /////////////////////////////////////////////////////////////////////////////////
  searchResults: string;

  private getNutrientsRecommendations(questionnaireId: string) {
    this.nutrientsRecommendationsService.getNutrientsRecommendationsByQuestionnaireId(questionnaireId).subscribe(
      data => {
        this.onModalRequest(questionnaireId);
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
        dialogRef.componentInstance.router = this.router;
      }
    );
  }

  private getFoodRecommendations(questionnaireId: string) {
    this.foodRecommendationsService.getFoodRecommendationsByQuestionnaireId(questionnaireId).subscribe(
      data => {
        this.onModalRequestFood(questionnaireId);
      },
      error => {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = error.error.message;
        dialogRef.componentInstance.router = this.router;
      }
    );
  }

  onModalRequest(id: string): void {
    const modalRef = this.errorDialog.open(RecommendModalComponent);
    modalRef.componentInstance.id = id;
  }

  onModalRequestFood(id: string): void {
    console.log('this.breastMilkFlag');
    const modalRef = this.errorDialog.open(FoodRecommendModalComponent, {
      // the FoodRecommendModalComponent is independent component, in order to access the data which I can only get in current component,
      // pass the data by this method
      data: this.breastMilkFlag
    });
    modalRef.componentInstance.id = id;
  }

  export() {
    this.exportService.exportFFQResults(this.results, this.ffqparentList, 'FFQ_Results');
  }

  private setFoodList() {
    this.results.forEach(result => {
      const recommendedFood: FFQFoodRecommendations[] = [];
      this.foodRecommendationsService.getFoodRecommendationsByQuestionnaireId(result.questionnaireId).subscribe(
        data => {
          recommendedFood.push(data);
        },
      );
      result.foodRecList = recommendedFood;
    });
  }

  getParentUsernameById(userId: string) {
    return this.ffqparentList.find(parent => parent.userId === userId)?.username ?? "[not found]";
  }
}
