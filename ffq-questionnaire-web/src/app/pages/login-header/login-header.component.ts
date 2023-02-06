import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
    selector: 'login-header',
    templateUrl: 'login-header.component.html',
    styleUrls: ['./login-header.component.css']
})
export class LoginHeaderComponent implements OnInit{

    TITLE = 'Login Page';

    constructor() { }

     ngOnInit() {

  }


}
