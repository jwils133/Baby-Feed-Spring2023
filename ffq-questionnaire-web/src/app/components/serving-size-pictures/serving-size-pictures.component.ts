import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

export interface DialogData {
  title: string;
  imageUrl: string;
  messages: string[];
}

@Component({
  selector: "app-serving-size-pictures",
  templateUrl: "./serving-size-pictures.component.html",
  styleUrls: ["./serving-size-pictures.component.css"],
})
export class ServingSizePicturesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ServingSizePicturesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
}
