import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;

    //Checks if there is a user currently logged in, if not then routes you to the login page
    if (currentUser) {
      var urlType = this.getUrlType(state.url);

      if (currentUser[0].usertype == "admin") {
        if (urlType != "/admin") {
          this.router.navigate(["/admin/home"]);
        }
      } else if (currentUser[0].usertype == "parent") {
        if (urlType != "/parent") {
          this.router.navigate(["parent/home"]);
        }
      } else if (currentUser[0].usertype == "clinician") {
        if (urlType != "/clinic") {
          this.router.navigate(["/clinic/home"]);
        }
      } else if (currentUser[0].usertype == "researcher") {
        if (urlType != "/researcher") {
          this.router.navigate(["/researcher/home"]);
        }
      } else if (currentUser[0].usertype == "participant") {
        if (urlType != "/participant") {
          this.router.navigate(["/participant/home"]);
        }
      }

      return true;
    }

    // not logged in so redirect to login page with the return url

    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private getUrlType(state: string): string {
    var urlType = "/";
    var i;
    for (i = 1; i < state.length; i++) {
      if (state[i] == "/") {
        i = state.length - 1;
        break;
      }
      urlType += state[i];
    }
    return urlType;
  }
}
