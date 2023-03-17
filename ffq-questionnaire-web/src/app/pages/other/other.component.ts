import { Component, OnInit } from '@angular/core';
import { Description } from 'src/app/models/ffqfooddescription';
import { Observable } from 'rxjs';
import { FoodDescriptionService } from 'src/app/services/food-description/food-description.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { formatDate } from '@angular/common';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { TrackerResultsResponse } from 'src/app/models/trackerresultsresponse';
import { TrackerItems } from 'src/app/models/trackeritems';
import { TrackerResponseService } from 'src/app/services/tracker-response/tracker-response.service';
import { HttpErrorResponse } from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import { User } from 'src/app/services/authentication/temp-user';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']

})
export class OtherComponent {
  TITLE = this.translate.instant('Parent Portal');
  currentUser: User;
    router: Router;

    constructor(router: Router, private authenticationService: AuthenticationService, private translate: TranslateService) {
      this.router = router;
      this.authenticationService = this.authenticationService;
    }
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    introduction1() {
      window.open('https://www.youtube.com/watch?v=l-n-dvAfpDQ', '_blank');
    }

    introduction2() {
      window.open('https://www.youtube.com/watch?v=WN_QAiZdbiE', '_blank');
    }

    firstFood(){
      window.open('https://www.youtube.com/watch?v=DpucN2eNG8s', '_blank');
    }

    firstFoodNC(){
      window.open('https://www.youtube.com/watch?v=1nltYRgthj4', '_blank');
    }

    sweetPot(){
      window.open('https://www.youtube.com/watch?v=iQmGyom49Hg', '_blank');
    }

    papillas1(){
      window.open('https://www.youtube.com/watch?v=HLnkWaqaywA', '_blank');
    }
    
    papillas2(){
      window.open('https://www.youtube.com/watch?v=FjlwlgL0hgM', '_blank');
    }

    howMuchE(){
      window.open('https://www.youtube.com/watch?v=CCaR8n0Qwk0', '_blank');
    }

    howMuchS(){
      window.open('https://www.youtube.com/watch?v=3arYE01K4Fs', '_blank');
    }

    foodToAvoidE(){
      window.open('https://www.youtube.com/watch?v=uGSkpChO7x8', '_blank');
    }

    foodToAvoidS(){
      window.open('https://www.youtube.com/watch?v=I9hBvb2dIlI', '_blank');
    }



}
