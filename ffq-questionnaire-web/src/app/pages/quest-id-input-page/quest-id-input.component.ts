import {Component, OnChanges} from '@angular/core';
import {QuestionnaireValidatorService} from '../../services/questionnaire-validator/questionnaire-validator.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogPopupComponent} from '../../components/error-dialog-popup/error-dialog-popup.component';
import {FFQItem} from '../../models/ffqitem';
import {HttpErrorResponse} from '@angular/common/http';
import {QuestionnaireResponse} from '../../models/questionnaire-response';
import {Observable} from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'quest-id-input',
  templateUrl: './quest-id-input.component.html',
  styleUrls: ['./quest-id-input.component.css']
})
export class QuestIdInputComponent {
  TITLE = 'Parent Portal';
  questionnaire: QuestionnaireResponse;

  constructor(
    private router: Router,
    private errorDialog: MatDialog,
    private questService: QuestionnaireValidatorService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService){}

  toggleLanguage(): void {
    // If page is currently spanish go to english
    if (this.translate.currentLang == 'es') {
      this.translate.use('en-US');
    }
    // Else if page is not spanish go to spanish
    else {
      this.translate.use('es');
    }
  }

  validateQuestionnaireId(id: string) {
    this.questService.getQuestionnaireId(id).subscribe((data: QuestionnaireResponse) => {
      if (data.exists) {
        if (data.submitted) {
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = 'Questionnaire Already Submitted';
          dialogRef.componentInstance.message = 'Please check the ID and try again or contact the issuer.';
        } else {
          const urlString = '/parent/questionnaire/' + id;
          this.router.navigateByUrl(urlString);
        }
      } else {
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = 'Invalid Questionnaire Id';
        dialogRef.componentInstance.message = 'Please check the ID and try again or contact the issuer.';
      }
    }, (error: Error) => this.handleQuestionnaireError(error));
  }

  startQuestionnaire() {
    const id = this.authenticationService.currentUserId + '-' + Date.now();
    this.router.navigateByUrl('/parent/questionnaire/' + id);
  }

  private handleQuestionnaireError(error: Error) {
    console.error('Error occurred: ' + error.message);
    const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
    dialogRef.componentInstance.title = 'Error Validating Id';
    dialogRef.componentInstance.message = error.message + '. Please contact administrator.';
  }
}
