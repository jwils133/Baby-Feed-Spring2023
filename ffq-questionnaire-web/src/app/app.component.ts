import { Component, LOCALE_ID, Inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';
import {TranslateService} from '@ngx-translate/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ffq-questionnaire-web';
  idleState = 'Not started';
  timedOut = false;
  lastPing?: Date = null;
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, @Inject(LOCALE_ID) protected localeId: string,
              private translate: TranslateService, private idle: Idle, private keepalive: Keepalive,
              private activatedRoute: ActivatedRoute, private router: Router)
  {
    translate.setDefaultLang('en-US');
    this.matIconRegistry.addSvgIcon(
      "up_arrow",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/up_arrow.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "down_arrow",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/down_arrow.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "equal_sign",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/images/equal_sign.svg")
    );


    // sets an idle timeout of 5 minutes ( 5 * 60 seconds), for testing purposes.
    idle.setIdle(5 * 60);
    // sets a timeout period of 5 minutes (5 * 60 seconds). after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(24 * 60 * 60); // change to 24 hours to log out according to Prof's ask
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.router.navigateByUrl('logout').then(() => localStorage.removeItem('currentUser'));
    });
    // sets the ping interval to 15 seconds
    keepalive.interval(5 * 60);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started';
    this.timedOut = false;
  }
}
