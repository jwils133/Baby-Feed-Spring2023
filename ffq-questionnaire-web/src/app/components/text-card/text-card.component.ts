import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'text-card',
  templateUrl: './text-card.component.html',
  styleUrls: ['./text-card.component.css']
})
export class TextCardComponent {
  @Input() mainMessage: string;
  @Input() bulletedMessages: string[];
  @Input() instructionsTitle: string;

}
