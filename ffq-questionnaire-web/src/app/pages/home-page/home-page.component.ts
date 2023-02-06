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
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css', '../parental-header/parental-header.component.css']
  })

export class HomePageComponent {

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
}