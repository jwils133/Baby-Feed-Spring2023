import { Component, OnInit, Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

export interface PeriodicElement {
  position: number;
  from: string;
  to: string;
}

export interface DialogData {
  language: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, from: "1 Inch (in)", to: "2.54 Centimeters (cm)" },
  { position: 2, from: "2.204623 Pounds (lb)", to: "1 Kilogram (kg)" },
];

@Component({
  selector: "app-growth-charts-help",
  templateUrl: "./growth-charts-help.component.html",
  styleUrls: ["./growth-charts-help.component.css"],
})
export class GrowthChartsHelpComponent implements OnInit {
  displayedColumns: string[] = ["position", "from", "to"];
  dataSource = ELEMENT_DATA;

  menuPicture: string = "../assets/images/growth_charts_help/en/menu.png";
  selectChildPicture: string =
    "../assets/images/growth_charts_help/en/selectChild.png";
  genderChildPicture: string =
    "../assets/images/growth_charts_help/en/genderChild.png";
  selectUnitsOfMeasurementsPicture: string =
    "../assets/images/growth_charts_help/en/selectUnitsOfMeasurements.png";
  ageChildPicture: string =
    "../assets/images/growth_charts_help/en/ageChild.png";
  heightChildPicture: string =
    "../assets/images/growth_charts_help/en/heightChild.png";
  weightChildPicture: string =
    "../assets/images/growth_charts_help/en/weightChild.png";
  addButtonPicture: string = "../assets/images/growth_charts_help/en/add.png";
  saveButtonPicture: string = "../assets/images/growth_charts_help/en/save.png";
  chartOptionsPicture: string =
    "../assets/images/growth_charts_help/en/chartOptions.png";

  constructor(
    private translate: TranslateService,
    public dialogRef: MatDialogRef<GrowthChartsHelpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    if (this.translate.currentLang === "es") {
      this.menuPicture = "../assets/images/growth_charts_help/es/menu.png";
      this.selectChildPicture =
        "../assets/images/growth_charts_help/es/selectChild.png";
      this.genderChildPicture =
        "../assets/images/growth_charts_help/es/genderChild.png";
      this.selectUnitsOfMeasurementsPicture =
        "../assets/images/growth_charts_help/es/selectUnitsOfMeasurements.png";
      this.ageChildPicture =
        "../assets/images/growth_charts_help/es/ageChild.png";
      this.heightChildPicture =
        "../assets/images/growth_charts_help/es/heightChild.png";
      this.weightChildPicture =
        "../assets/images/growth_charts_help/es/weightChild.png";
      this.addButtonPicture = "../assets/images/growth_charts_help/es/add.png";
      this.saveButtonPicture =
        "../assets/images/growth_charts_help/es/save.png";
      this.chartOptionsPicture =
        "../assets/images/growth_charts_help/es/chartOptions.png";
    }
  }
}
