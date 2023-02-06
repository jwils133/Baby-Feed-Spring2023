import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { User } from 'src/app/services/authentication/temp-user';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'researchparental-header',
  templateUrl: './research-parental-header.component.html',
  styleUrls: ['./research-parental-header.component.css']
})
export class ResearchParentalHeaderComponent {
    TITLE = this.translate.instant('Participant Portal');
    currentUser: User;
    router: Router;

    constructor(router: Router, private authenticationService: AuthenticationService,private translate: TranslateService) {
      this.router = router;
      this.authenticationService = this.authenticationService;
        //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
