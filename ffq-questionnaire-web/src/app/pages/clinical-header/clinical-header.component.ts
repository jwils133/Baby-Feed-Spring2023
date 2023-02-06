/*

  Added by Javier Romero
  This is the header for the clinician portal.
  All pages in the clinician portal will have this header.
  Khalid Alamoudi: added authentication components.

*/

import { Component, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'clinical-header',
  templateUrl: './clinical-header.component.html',
  styleUrls: ['./clinical-header.component.css']
})

export class ClinicalHeaderComponent{

  router: Router;
  authenticationService: AuthenticationService;

  constructor(
    router: Router,
    authenticationService: AuthenticationService
    )
  {
    this.router = router;
    this.authenticationService = authenticationService;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

