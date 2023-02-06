import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error-dialog-popup',
  templateUrl: './error-dialog-popup.component.html',
  styleUrls: ['./error-dialog-popup.component.css']
})
export class ErrorDialogPopupComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() router: Router;
}
