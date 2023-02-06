import { Component, OnInit, Inject } from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

export interface DialogData {
  title: string;
  name: string;
  value: string;
  messages: string[];
  language: string;
}

@Component({
  selector: "app-interpretation-growth-charts-dialog",
  templateUrl: "./interpretation-growth-charts-dialog.component.html",
  styleUrls: ["./interpretation-growth-charts-dialog.component.css"],
})
export class InterpretationGrowthChartsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InterpretationGrowthChartsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
}
