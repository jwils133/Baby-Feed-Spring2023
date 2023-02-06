import { Component,Input } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ResearcherParticipantService } from 'src/app/services/research-participant/research-participant-service';
import { FFQResearcher } from "src/app/models/ffqresearcher";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-participant-modal',
  templateUrl: './create-participant-modal.component.html',
  styleUrls: ['./create-participant-modal.component.css']
})
export class CreateParticipantModalComponent{
  @Input() id;
  @Input() service;
  @Input() researcher: FFQResearcher;
  data: any;

  currentUser = <FFQResearcher>JSON.parse(localStorage.getItem('currentUser'))[0];
  remainingParticipants = localStorage.getItem("remainingParticipants");


  constructor(
    public activeModal: NgbActiveModal,
    public participantsService: ResearcherParticipantService,
    private router: Router,
    private errorDialog: MatDialog) {
  }

  onCreateParticipants(form: NgForm){
    if(form.invalid){
      return;
    }
    this.participantsService.addParent(form.value);
    form.resetForm();
    this.activeModal.close('closed');
  }

  onClose(): void {
      this.service.deleteItem(this.id).subscribe(newData => {
          this.data = newData;
          window.location.reload();
      });
      this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }
}
