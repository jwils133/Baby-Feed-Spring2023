/*

  Added by Version 2.0 group, edited by Javier Romero
  This serves as the header for the admin portal. All pages in the admin portal have this as their header.
  Khalid Alamoudi: Added Authentication service components.
  
*/

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  
  currentUser: User;

  constructor(private router: Router, private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }

}

