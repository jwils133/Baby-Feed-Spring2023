/*

  Added by Javier Romero, David Nader, Khalid Alamoudi
  This is the login page for the FFQ Project (/login).
  Upon successful login, the user will be redirected to the appropriate user portal based on their login credentials.

*/

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  accountList: string[] = ["admins", "clinicians", "parents"];
  dropDownName: string[] = ["Admin", "Clinician", "Parent"];
  username = '';
  password = '';


  //userType: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private translate: TranslateService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]//,
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Method for lang button
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
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value/*, this.f.userType.value*/)
      .pipe(first())
      .subscribe(
        data => {
          // this.router.navigate([this.returnUrl]);
          this.router.navigate(['/']);
        },
        err => {
          this.error = err.error.message != undefined ? err.error.message : 'Error trying to login';
          this.loading = false;
        });
  }

}
