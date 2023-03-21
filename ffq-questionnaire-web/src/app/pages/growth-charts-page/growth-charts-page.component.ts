/*
author: Vladimir Chavez

I will assume that every parent will have the following property: childrennames which cannot be empty or null, in case
of being empty or null will give an error. To avoid this, it is necessary to add the capability of adding names of 
children which is not implemented.
This (childrennames) property will have the first name of all children of the current parent. I will add an 
ArrayList of type Children to the db (database) to save the data to plot the growth charts
, so the previous data needs to be modify later on. However, the implementation of the 
growth-chart tab will not give any error for missing the children property.
the children property will be added once the data is saved. Children has the following structure 
{name: string; childData:{weight: string; height: string; age: string} where the property
name will be copied from the property childrennames to identify each child. In addition, 
childData will be provided from the user input. 

To select a specific child a menu will show the children names of the property childrennames. 

currentParent: FFQParentResponse <---> the data from current logged in parent 
will be retrieved from the db and saved to currentParent. method: ngOnInit(). FFQParentResponse is a class used to save
the data to the db. That being said, the following case will be explained to clarify the use of the 
ArrayList childrenList. For example, the childrennames has all the names of the parent's children while the arraylist 
children will have all the data of the parent's inputs. So, it might be possible that there are children
that does not have any data saved in the children arraylist because the parent has not saved it yet,
so it is easy to create a children list where all the children are created using the names of the 
childrennames arraylist and the data from the arraylist children is mapped using the names. 
Note that a parent cannot have two children with the same name otherwise will give errors, and childID will need to be 
added. 

Hence, the childrenlist will have chidren without any data and children with data. Example:

{
  "assignedclinic": "1",
  "assignedclinician": "1",
  "childrennames": ["Sarah","Tom"],
  "prefix": "Borinquen",
  "children": [
    {
      "name": "Tom",
      "childData": [
        {
          "weight": "48",
          "height": "52",
          "age": "12"
        }
      ]
    }
  ],
  "timesOfReading": 0,
  "userId": "1",
  "username": "Borinquen_1",
  "userpassword": "parent1",
  "usertype": "parent",
  "firstname": "John",
  "lastname": "Doe",
  "isactive": true,
  "_class": "edu.fiu.ffqr.models.Parent"
}


{
  "userId": "3",
  "username": "FIU_1",
  "userpassword": "parent1",
  "usertype": "parent",
  "firstname": "",
  "lastname": "",
  "assignedclinic": "2",
  "assignedclinician": "2",
  "childrennames": ["Abagail"],
  "isactive": true,
  "prefix": "FIU"
}

currentChild: FFQChildren <---> when a specific child is selected from the menu. the data of the child will be retrieved 
from childList arraylist. method: onChildrenChange()


childrenList: FFQChildren[] <---> contains all the children with or without data. For creating the childrenlist 
the names will be taken from childrennames and the data from the children arraylist.
 

*/

import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ThemePalette } from "@angular/material/core";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
import html2canvas from "html2canvas";

import { ParentService } from "src/app/services/parent/parent-service";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { FFQParentResponse } from "src/app/models/ffqparent-response";

import { FFQChildren } from "src/app/models/ffqchildren";
import { FFQChildData } from "src/app/models/ffq-childData";

import {
  UnitsOfMeasurement,
  Gender,
  ChartOption,
  GrowthChartData,
} from "src/app/models/Enums";

import 'apexcharts';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexTooltip,
  ApexMarkers,
  ApexXAxis
} from "ng-apexcharts";


/* 
  The information needed to plot the charts are imported from the following directory:
  assets/growth-charts-data/who 

*/

//boys/bmi

//bmi
import { BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/boys/metric system/bmi/BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//boys/metric system

//height - age
import { BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/boys/metric system/height - age/BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//weight - age
import { BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/boys/metric system/weight - age/BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//weight - height
import { BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/boys/metric system/weight - height/BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//girls/bmi

//bmi
import { GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/girls/metric system/bmi/GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//girls/metric system

//height - age
import { GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/girls/metric system/height - age/GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//weight - age
import { GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/girls/metric system/weight - age/GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//weight - height
import { GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM } from "../../../assets/growth-charts-data/who/girls/metric system/weight - height/GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM";

//boys/mixed

//weight - height - mixed: kg_vs_in
import { BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN } from "src/assets/growth-charts-data/who/boys/mixed/BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN";

//weight - height - mixed: lb_vs_cm
import { BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM } from "src/assets/growth-charts-data/who/boys/mixed/BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM";

//boys/us customary system

//height - age
import { BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM } from "src/assets/growth-charts-data/who/boys/US customary system/height - age/BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM";

//weight - age
import { BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM } from "src/assets/growth-charts-data/who/boys/US customary system/weight - age/BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM";

//weight - height
import { BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM } from "src/assets/growth-charts-data/who/boys/US customary system/weight - height/BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM";

//girls/mixed

//weight - height - mixed: kg_vs_in
import { GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN } from "src/assets/growth-charts-data/who/girls/mixed/GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN";

//weight - height - mixed: lb_vs_cm
import { GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM } from "src/assets/growth-charts-data/who/girls/mixed/GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM";

//girls/us customary system

//height - age
import { GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM } from "src/assets/growth-charts-data/who/girls/US customary system/height - age/GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM";

//weight - age
import { GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM } from "src/assets/growth-charts-data/who/girls/US customary system/weight - age/GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM";

//weight - height
import { GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM } from "src/assets/growth-charts-data/who/girls/US customary system/weight - height/GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM";
import { InterpretationGrowthChartsDialogComponent } from "src/app/components/interpretation-growth-charts-dialog/interpretation-growth-charts-dialog.component";
import { GrowthChartsHelpComponent } from "src/app/components/growth-charts-help/growth-charts-help.component";
import { NgForm, NgModel } from "@angular/forms";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { stringify } from "querystring";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class DataManipulation {
  static getDeepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
  }
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

@Component({
  selector: "app-growth-charts-page",
  templateUrl: "./growth-charts-page.component.html",
  styleUrls: ["./growth-charts-page.component.css"],
})
export class GrowthChartsPageComponent implements OnInit {
  @ViewChild("chart") growthChart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


  //who

  //boys
  //bmi
  BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];

  //height - age
  BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];
  BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM: any[];

  //weight - age
  BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];
  BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM: any[];

  //weight - height
  BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];
  BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM: any[];

  //weight - height - mixed
  BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN: any[];
  BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM: any[];

  //girls

  //bmi
  GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];

  //height - age
  GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];
  GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM: any[];

  //weight - age
  GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];
  GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM: any[];

  //weight - height
  GIRLS_WEIGHT_FOR_LENGTH_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM: any[];
  GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM: any[];

  //weight - height - mixed
  GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM: any[];
  GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN: any[];

  // constant to validate the max and min values allowed
  readonly MAX_AGE_MONTHS = 24;
  readonly MIN_AGE_MONTHS = 0;
  // these are mutable depends on the units of measurements, by default they are in metric system.
  MAX_HEIGHT = 110;
  MIN_HEIGHT = 40;
  MAX_WEIGHT = 30;
  MIN_WEIGHT = 1;

  // determines the measurement units selected by the user
  heightUnitOptions: UnitsOfMeasurement = UnitsOfMeasurement.cm;
  weightUnitOptions: UnitsOfMeasurement = UnitsOfMeasurement.kg;

  // curent child data entered by the user
  currentChildName: string = "";
  currentChildHeight: string = "";
  currentChildWeight: string = "";
  currentChildAge: string = "";
  currentChildGender: Gender.NotAssigned;

  // current child
  currentChild: FFQChildren = {} as FFQChildren;

  // children list to avoid working with currentParent.children
  childrenList: FFQChildren[] = [];

  // current parent, data retrived from db
  currentParent: FFQParentResponse;

  myDocDefinition: any;
  loading: boolean = false;
  color: ThemePalette = "primary";
  mode: ProgressSpinnerMode = "indeterminate";
  value = 65;


  /* CHART UPDATE 8: Delete the following chart resources comment and replace it with the following comment 
  providing resources about the new chart library 


  charts options
  example: https://apexcharts.com/angular-chart-demos/
  documentation: https://apexcharts.com/docs/chart-types/area-chart/#
  
  */


  /* 
  charts options
  example: https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical
  documentation: https://swimlane.gitbook.io/ngx-charts/
  */

  //legend: boolean = true;
  //showLabels: boolean = true;
  //animations: boolean = true;
  //xAxis: boolean = true;
  //yAxis: boolean = true;
  //showYAxisLabel: boolean = false;
  //showXAxisLabel: boolean = false;
  //xAxisLabel: string = "";
  //yAxisLabel: string = "";
  //timeline: boolean = true;
  //view: any[] = [1400, 1400];
  //results: any[] = [];
  //position: string = "right";

  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis; //| ApexYAxis[];
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;

  // to determine the chart selected by the user
  chosenChartOption: ChartOption = ChartOption.NotAssigned;

  // to determine the kind of chart selected by the user depending on gender and units of measurements
  currentGrowthChartData: GrowthChartData = GrowthChartData.NONE;

  lang: boolean = true;

  // colors used to plot the diferent graphs
  colorScheme = {
    domain: [
      "#C20000",
      "#DB9600",
      "#DB9600",
      "#518675",
      "#518675",
      "#518675",
      "#518675",
      "#518675",
      "#DB9600",
      "#DB9600",
      "#C20000",
      "#000000",
    ],
  };

  dataWasAdded: boolean = true;

  /* CHART UPDATE 9: Add the chart options to create the combo-area-line chart as done in Jada's dummy graph
  
        Things to figure out related to this:

              - Will this code need to be in the constructor or outside of the constructor?

              - How will we need to change the dummy example code to be able accept the values for the x-axis and 
                y-axis chosen based on the units (kg & cm, kg & in, lbs & cm, or lbs & in) selected by the user
                rather than using the hard-coded values for the x-axis and y-axis that appear in the dummy example
                code (ex:   data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]  as in series with name Team A)?
  */

  constructor(
    private parentService: ParentService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    // assigns the data to be used on the charts
    Object.assign(this, {
      /*
      BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM,
      BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM,
      */
      BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      /*
      BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM,
      BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN,
      BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM,
      */

      /*
      GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM,
      GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM,
      */
      GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM,
      /*
      GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM,
      GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN,
      GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM,
      */
    });

    this.currentParent = new FFQParentResponse(
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      [] as string[],
      true,
      "",
      "",
      0,
      [] as FFQChildren[]
    );

    this.currentChild = new FFQChildren("", [] as FFQChildData[]);

  }

  public generateData(count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }



  onSubmitChildPersonalInformationForm() {
    console.log("Working in progress submitting  Child Personal Information");
  }

  onSubmitChildBodyMeasurementsForm() {
    let index = this.currentParent.children.findIndex(
      (x) => x.name === this.currentChildName
    );
    if (index > -1) {
      this.currentParent.children[index] = this.currentChild;
    } else {
      this, this.currentParent.children.push(this.currentChild);
    }
    this.parentService
      .updateParent(<FFQParentResponse>this.currentParent)
      .subscribe();
    this.dataWasAdded = true;
  }

  onSubmitChartOptionsForm() {
    console.log("Working in progress submitting Chart options");
  }

  /*
    The min and max values of heigth and weight change depending on the units of measurements.
    The charts need to update their labels that is why the method onTypeChartChange is called.
  */
  onUnitsChange(typeOfChart: ChartOption) {
    if (
      this.heightUnitOptions === UnitsOfMeasurement.cm &&
      this.weightUnitOptions === UnitsOfMeasurement.kg
    ) {
      this.MAX_HEIGHT = 110;
      this.MIN_HEIGHT = 40;
      this.MAX_WEIGHT = 30;
      this.MIN_WEIGHT = 1;
    } else if (
      this.heightUnitOptions === UnitsOfMeasurement.cm &&
      this.weightUnitOptions === UnitsOfMeasurement.lb
    ) {
      this.MAX_HEIGHT = 110;
      this.MIN_HEIGHT = 40;
      this.MAX_WEIGHT = Math.round(30 * FFQChildren.KG_TO_LB);
      this.MIN_WEIGHT = Math.round(1 * FFQChildren.KG_TO_LB);
    } else if (
      this.heightUnitOptions === UnitsOfMeasurement.in &&
      this.weightUnitOptions === UnitsOfMeasurement.lb
    ) {
      this.MAX_HEIGHT = Math.round(110 / FFQChildren.IN_TO_CM);
      this.MIN_HEIGHT = Math.round(40 / FFQChildren.IN_TO_CM);
      this.MAX_WEIGHT = Math.round(30 * FFQChildren.KG_TO_LB);
      this.MIN_WEIGHT = Math.round(1 * FFQChildren.KG_TO_LB);
    } else if (
      this.heightUnitOptions === UnitsOfMeasurement.in &&
      this.weightUnitOptions === UnitsOfMeasurement.kg
    ) {
      this.MAX_HEIGHT = Math.round(110 / FFQChildren.IN_TO_CM);
      this.MIN_HEIGHT = Math.round(40 / FFQChildren.IN_TO_CM);
      this.MAX_WEIGHT = 30;
      this.MIN_WEIGHT = 1;
    }
    this.onTypeChartChange(typeOfChart);
  }

  /*
    Adds points to the charts. The points are saved using the metric system, 
    so that is why the data is converted to the metric system. The WHO data is provided using the metric system.
    To plot the data with different units of measurements the data is converted from the metric system
    to us customary system in case of inches and pounds. After adding the data the method plottingData()
    to plot the new data
  */
  onAddingData(childBodyMeasurementsForm: NgForm) {
    let ageValue = Number.parseInt(
      childBodyMeasurementsForm.controls["ageControl"].value
    );

    let weightValue = Number.parseFloat(
      childBodyMeasurementsForm.controls["weightControl"].value
    );

    let heightValue = Number.parseFloat(
      childBodyMeasurementsForm.controls["heightControl"].value
    );

    if (
      ageValue <= this.MAX_AGE_MONTHS &&
      ageValue >= this.MIN_AGE_MONTHS &&
      weightValue <= this.MAX_WEIGHT &&
      weightValue >= this.MIN_WEIGHT &&
      heightValue <= this.MAX_HEIGHT &&
      heightValue >= this.MIN_HEIGHT
    ) {
      if (
        this.heightUnitOptions === UnitsOfMeasurement.cm &&
        this.weightUnitOptions === UnitsOfMeasurement.kg
      ) {
        this.currentChild.addData(
          new FFQChildData(
            this.currentChildWeight,
            this.currentChildHeight,
            this.currentChildAge
          )
        );
      } else if (
        this.heightUnitOptions === UnitsOfMeasurement.cm &&
        this.weightUnitOptions === UnitsOfMeasurement.lb
      ) {
        this.currentChild.addData(
          new FFQChildData(
            (
              parseFloat(this.currentChildWeight) / FFQChildren.KG_TO_LB
            ).toString(),
            this.currentChildHeight,
            this.currentChildAge
          )
        );
      } else if (
        this.heightUnitOptions === UnitsOfMeasurement.in &&
        this.weightUnitOptions === UnitsOfMeasurement.lb
      ) {
        this.currentChild.addData(
          new FFQChildData(
            (
              parseFloat(this.currentChildWeight) / FFQChildren.KG_TO_LB
            ).toString(),
            (
              parseFloat(this.currentChildHeight) * FFQChildren.IN_TO_CM
            ).toString(),
            this.currentChildAge
          )
        );
      } else if (
        this.heightUnitOptions === UnitsOfMeasurement.in &&
        this.weightUnitOptions === UnitsOfMeasurement.kg
      ) {
        this.currentChild.addData(
          new FFQChildData(
            this.currentChildWeight,
            (
              parseFloat(this.currentChildHeight) * FFQChildren.IN_TO_CM
            ).toString(),
            this.currentChildAge
          )
        );
      }

      this.dataWasAdded = false;
      childBodyMeasurementsForm.resetForm();

      //this.plottingData();
      this.plottingDataNew();
    }
  }

  /*
  It is easier to copy the data from the original charts and add all the data entered by
  the user than modify the data from the charts adding and updating the data entered by the user. In other words,
  redoing the data using the original charts and the data from the current children (childdata) is easier than 
  create a data a structure to handle the necessary changes. By question of time the data structure
  is not implemented. The speed to process and handle the data is not significant in 
  the presented magnitud. However, an improvement can be avoid an intensive use of
  ram copying constantly the same data.
  */
  // plottingData() {
  //   let newResult = [];

  //   /* depending on the type of charts we will choose the correct chart taking into 
  //   account unit of measurements and gender */
  //   switch (this.currentGrowthChartData) {
  //     case GrowthChartData.BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         /* 
  //         the data needs to be copy using a deep copy method to avoid a reference
  //         modification of the data by mistake 
  //         */
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(this.currentChild.getBMIChartData());
  //       } else newResult = BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getHeightChartData(this.heightUnitOptions)
  //         );
  //       } else newResult = BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getHeightChartData(this.heightUnitOptions)
  //         );
  //       } else
  //         newResult =
  //           BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );

  //         newResult.push(
  //           this.currentChild.getWeightChartData(this.weightUnitOptions)
  //         );
  //       } else newResult = BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightChartData(this.weightUnitOptions)
  //         );
  //       } else
  //         newResult =
  //           BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult = BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM;
  //       break;
  //     case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(this.currentChild.getBMIChartData());
  //       } else newResult = GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getHeightChartData(this.heightUnitOptions)
  //         );
  //       } else
  //         newResult = GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getHeightChartData(this.heightUnitOptions)
  //         );
  //       } else
  //         newResult =
  //           GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightChartData(this.weightUnitOptions)
  //         );
  //       } else
  //         newResult = GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;

  //     case GrowthChartData.GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightChartData(this.weightUnitOptions)
  //         );
  //       } else
  //         newResult =
  //           GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult = GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //     case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN;
  //       break;
  //     case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM;
  //       break;
  //     case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
  //       if (this.currentChild.childData.length !== 0) {
  //         newResult = DataManipulation.getDeepCopy(
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
  //         );
  //         newResult.push(
  //           this.currentChild.getWeightHeightChartData(
  //             this.heightUnitOptions,
  //             this.weightUnitOptions
  //           )
  //         );
  //       } else
  //         newResult =
  //           GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
  //       break;
  //   }

  //   this.results = newResult;
  // }


  plottingDataNew() {
    let babyData: [number, number][];


    let rawBabyData: [number, number][];
    rawBabyData = this.currentChild.getWeightHeightChartDataNew(
      this.heightUnitOptions,
      this.weightUnitOptions
    );

    babyData = this.currentChild.extractBabyData(rawBabyData);
   if(this.currentChildGender != Gender.NotAssigned) {
    switch (this.currentChildGender) 
    {
      case (Gender.Female):
        this.chartOptions = {
          series: [
            {
              name: "Baby",
              type: "line",
              data: babyData
            },
            {
              name: ">98th",
              type: "area",
              // Values for boys
              data: [[45, 2.967084], [45.5, 3.06984], [46, 3.172493], [46.5, 3.275093], [47, 3.378141], [47.5, 3.482171], [48, 3.587909],
               [48.5, 3.696198], [49, 3.808005], [49.5, 3.924175], [50, 4.044951], [50.5, 4.170696], [51, 4.301291], [51.5, 4.436616], 
               [52, 4.57677], [52.5, 4.721321], [53, 4.869881], [53.5, 5.022438], [54, 5.177937], [54.5, 5.335877], [55, 5.495657], 
               [55.5, 5.656672], [56, 5.818439], [56.5, 5.980469], [57, 6.14253], [57.5, 6.304363], [58, 6.465836], [58.5, 6.626477],
                [59, 6.785923], [59.5, 6.943542], [60, 7.099354], [60.5, 7.25324], [61, 7.405039], [61.5, 7.554862], [62, 7.702988],
                 [62.5, 7.848883], [63, 7.993075], [63.5, 8.135803], [64, 8.277013], [64.5, 8.416754], [65, 8.554964], [65.5, 8.691701],
                  [66, 8.826775], [66.5, 8.960443], [67, 9.092201], [67.5, 9.222481], [68, 9.350843], [68.5, 9.477926], [69, 9.603447],
                   [69.5, 9.727939], [70, 9.851105], [70.5, 9.973033], [71, 10.09421], [71.5, 10.21474], [72, 10.33418], [72.5, 10.45285],
                    [73, 10.57052], [73.5, 10.68695], [74, 10.80143], [74.5, 10.91467], [75, 11.02607], [75.5, 11.13648], [76, 11.24553], 
                    [76.5, 11.35406], [77, 11.46269], [77.5, 11.57176], [78, 11.68189], [78.5, 11.7938], [79, 11.90735], [79.5, 12.02341],
                     [80, 12.14209], [80.5, 12.26386], [81, 12.3885], [81.5, 12.51662], [82, 12.64747], [82.5, 12.78146], [83, 12.91832], 
                     [83.5, 13.05767], [84, 13.19981], [84.5, 13.3441], [85, 13.4907], [85.5, 13.63914], [86, 13.78873], [86.5, 13.93974], 
                     [87, 14.09135], [87.5, 14.24285], [88, 14.39453], [88.5, 14.54617], [89, 14.69746], [89.5, 14.84848], [90, 14.99928],
                      [90.5, 15.14962], [91, 15.30007], [91.5, 15.45063], [92, 15.60123], [92.5, 15.75198], [93, 15.90298], [93.5, 16.05472],
                       [94, 16.20688], [94.5, 16.35968], [95, 16.51348], [95.5, 16.66866], [96, 16.82461], [96.5, 16.98172], [97, 17.14033], 
                       [97.5, 17.30046], [98, 17.4626], [98.5, 17.62701], [99, 17.79341], [99.5, 17.96283], [100, 18.13461], [100.5, 18.31016], 
                       [101, 18.48819], [101.5, 18.66963], [102, 18.85472], [102.5, 19.04254], [103, 19.23456], [103.5, 19.4292], [104, 19.62753],
                        [104.5, 19.82933], [105, 20.03387], [105.5, 20.24213], [106, 20.45414], [106.5, 20.66926], [107, 20.8885], [107.5, 21.1113],
                         [108, 21.33837], [108.5, 21.56869], [109, 21.80317], [109.5, 22.04124], [110, 22.28267] 
              ]
            },
            {
              name: "98th",
              type: "area",
              data: [[45, 2.967084], [45.5, 3.06984], [46, 3.172493], [46.5, 3.275093], [47, 3.378141], [47.5, 3.482171], [48, 3.587909],
               [48.5, 3.696198], [49, 3.808005], [49.5, 3.924175], [50, 4.044951], [50.5, 4.170696], [51, 4.301291], [51.5, 4.436616], 
               [52, 4.57677], [52.5, 4.721321], [53, 4.869881], [53.5, 5.022438], [54, 5.177937], [54.5, 5.335877], [55, 5.495657], 
               [55.5, 5.656672], [56, 5.818439], [56.5, 5.980469], [57, 6.14253], [57.5, 6.304363], [58, 6.465836], [58.5, 6.626477], 
               [59, 6.785923], [59.5, 6.943542], [60, 7.099354], [60.5, 7.25324], [61, 7.405039], [61.5, 7.554862], [62, 7.702988],
                [62.5, 7.848883], [63, 7.993075], [63.5, 8.135803], [64, 8.277013], [64.5, 8.416754], [65, 8.554964], [65.5, 8.691701],
                 [66, 8.826775], [66.5, 8.960443], [67, 9.092201], [67.5, 9.222481], [68, 9.350843], [68.5, 9.477926], [69, 9.603447],
                  [69.5, 9.727939], [70, 9.851105], [70.5, 9.973033], [71, 10.09421], [71.5, 10.21474], [72, 10.33418], [72.5, 10.45285], 
                  [73, 10.57052], [73.5, 10.68695], [74, 10.80143], [74.5, 10.91467], [75, 11.02607], [75.5, 11.13648], [76, 11.24553],
                   [76.5, 11.35406], [77, 11.46269], [77.5, 11.57176], [78, 11.68189], [78.5, 11.7938], [79, 11.90735], [79.5, 12.02341], 
                   [80, 12.14209], [80.5, 12.26386], [81, 12.3885], [81.5, 12.51662], [82, 12.64747], [82.5, 12.78146], [83, 12.91832], 
                   [83.5, 13.05767], [84, 13.19981], [84.5, 13.3441], [85, 13.4907], [85.5, 13.63914], [86, 13.78873], [86.5, 13.93974], 
                   [87, 14.09135], [87.5, 14.24285], [88, 14.39453], [88.5, 14.54617], [89, 14.69746], [89.5, 14.84848], [90, 14.99928],
                    [90.5, 15.14962], [91, 15.30007], [91.5, 15.45063], [92, 15.60123], [92.5, 15.75198], [93, 15.90298], [93.5, 16.05472],
                     [94, 16.20688], [94.5, 16.35968], [95, 16.51348], [95.5, 16.66866], [96, 16.82461], [96.5, 16.98172], [97, 17.14033],
                      [97.5, 17.30046], [98, 17.4626], [98.5, 17.62701], [99, 17.79341], [99.5, 17.96283], [100, 18.13461], [100.5, 18.31016],
                       [101, 18.48819], [101.5, 18.66963], [102, 18.85472], [102.5, 19.04254], [103, 19.23456], [103.5, 19.4292],
                        [104, 19.62753], [104.5, 19.82933], [105, 20.03387], [105.5, 20.24213], [106, 20.45414], [106.5, 20.66926],
                         [107, 20.8885], [107.5, 21.1113], [108, 21.33837], [108.5, 21.56869], [109, 21.80317], [109.5, 22.04124], [110, 22.28267] ]
            },
            {
              name: "95th",
              type: "area",
              data: [[45, 2.867253], [45.5, 2.966503], [46, 3.065651], [46.5, 3.164758], [47, 3.264281], [47.5, 3.364751], [48, 3.466867], 
              [48.5, 3.571445], [49, 3.679418], [49.5, 3.791604], [50, 3.908237], [50.5, 4.029667], [51, 4.155778], [51.5, 4.286455], 
              [52, 4.421777], [52.5, 4.561358], [53, 4.704809], [53.5, 4.852097], [54, 5.00224], [54.5, 5.154738], [55, 5.309008], 
              [55.5, 5.464466], [56, 5.620645], [56.5, 5.777096], [57, 5.933551], [57.5, 6.089804], [58, 6.24573], [58.5, 6.400851],
              [59, 6.554815], [59.5, 6.707039], [60, 6.857516], [60.5, 7.006131], [61, 7.152759], [61.5, 7.297508], [62, 7.440617], 
              [62.5, 7.581605], [63, 7.720949], [63.5, 7.858882], [64, 7.995382], [64.5, 8.130467], [65, 8.264111], [65.5, 8.396335], 
              [66, 8.526991], [66.5, 8.656259], [67, 8.783722], [67.5, 8.909763], [68, 9.033992], [68.5, 9.156954], [69, 9.27845], 
              [69.5, 9.398919], [70, 9.518151], [70.5, 9.636192], [71, 9.753509], [71.5, 9.870218], [72, 9.985913], [72.5, 10.10082],
               [73, 10.21478], [73.5, 10.32754], [74, 10.43847], [74.5, 10.54816], [75, 10.65612], [75.5, 10.76308], [76, 10.86878], 
               [76.5, 10.97399], [77, 11.07925], [77.5, 11.18499], [78, 11.29176], [78.5, 11.40021], [79, 11.51029], [79.5, 11.62277], 
               [80, 11.73778], [80.5, 11.85579], [81, 11.97656], [81.5, 12.10066], [82, 12.22742], [82.5, 12.35716], [83, 12.48967], 
               [83.5, 12.62461], [84, 12.76219], [84.5, 12.90185], [85, 13.04369], [85.5, 13.18727], [86, 13.33201], [86.5, 13.47802], 
               [87, 13.62461], [87.5, 13.77109], [88, 13.91769], [88.5, 14.06419], [89, 14.21035], [89.5, 14.3562], [90, 14.50182], 
               [90.5, 14.647], [91, 14.79221], [91.5, 14.93748], [92, 15.08277], [92.5, 15.2282], [93, 15.37381], [93.5, 15.52006],
                [94, 15.66671], [94.5, 15.81397], [95, 15.96212], [95.5, 16.11153], [96, 16.26169], [96.5, 16.41294], [97, 16.56557], 
                [97.5, 16.71965], [98, 16.8756], [98.5, 17.03365], [99, 17.19368], [99.5, 17.35648], [100, 17.52161], [100.5, 17.69022], 
                [101, 17.86129], [101.5, 18.03555], [102, 18.21325], [102.5, 18.39363], [103, 18.57791], [103.5, 18.76476], [104, 18.95508],
                 [104.5, 19.14865], [105, 19.34491], [105.5, 19.54466], [106, 19.74792], [106.5, 19.95423], [107, 20.16441], [107.5, 20.378],
                  [108, 20.5956], [108.5, 20.81637], [109, 21.04105], [109.5, 21.26916], [110, 21.50047] ]
            },
            {
              name: "90th",
              type: "area",
              data: [[45, 2.769874], [45.5, 2.865707], [46, 2.961438], [46.5, 3.057139], [47, 3.153227], [47.5, 3.250226], [48, 3.348812], 
              [48.5, 3.449774], [49, 3.554011], [49.5, 3.662315], [50, 3.774909], [50.5, 3.892134], [51, 4.013876], [51.5, 4.140025], 
              [52, 4.270637], [52.5, 4.405377], [53, 4.543848], [53.5, 4.686003], [54, 4.830929], [54.5, 4.978124], [55, 5.127025], 
              [55.5, 5.277069], [56, 5.427805], [56.5, 5.578821], [57, 5.729813], [57.5, 5.880629], [58, 6.031152], [58.5, 6.180893], 
              [59, 6.329515], [59.5, 6.47648], [60, 6.621759], [60.5, 6.765237], [61, 6.906823], [61.5, 7.046623], [62, 7.184842], 
              [62.5, 7.321042], [63, 7.455657], [63.5, 7.588912], [64, 7.720817], [64.5, 7.851358], [65, 7.980543], [65.5, 8.10836], 
              [66, 8.234702], [66.5, 8.359674], [67, 8.482941], [67.5, 8.604839], [68, 8.725027], [68.5, 8.843963], [69, 8.961523], 
              [69.5, 9.07806], [70, 9.193444], [70.5, 9.307683], [71, 9.421228], [71.5, 9.534193], [72, 9.646221], [72.5, 9.757458], 
              [73, 9.867777], [73.5, 9.976953], [74, 10.0844], [74.5, 10.19061], [75, 10.29521], [75.5, 10.3988], [76, 10.50122], 
              [76.5, 10.60317], [77, 10.70513], [77.5, 10.80761], [78, 10.91107], [78.5, 11.01613], [79, 11.12282], [79.5, 11.23178],
               [80, 11.3432], [80.5, 11.45752], [81, 11.57452], [81.5, 11.69469], [82, 11.81743], [82.5, 11.94301], [83, 12.07127], 
               [83.5, 12.20189], [84, 12.33501], [84.5, 12.47014], [85, 12.60735], [85.5, 12.74617], [86, 12.88617], [86.5, 13.0273], 
               [87, 13.16899], [87.5, 13.31057], [88, 13.45221], [88.5, 13.5937], [89, 13.73487], [89.5, 13.87566], [90, 14.01625],
                [90.5, 14.15639], [91, 14.29651], [91.5, 14.43662], [92, 14.57674], [92.5, 14.717], [93, 14.85736], [93.5, 14.99828], 
                [94, 15.13957], [94.5, 15.28144], [95, 15.42411], [95.5, 15.56792], [96, 15.71244], [96.5, 15.858], [97, 16.00483], 
                [97.5, 16.15305], [98, 16.30299], [98.5, 16.45488], [99, 16.60874], [99.5, 16.76512], [100, 16.9238], [100.5, 17.0857],
                 [101, 17.25001], [101.5, 17.41733], [102, 17.58787], [102.5, 17.76106], [103, 17.93784], [103.5, 18.11715], [104, 18.29972],
                  [104.5, 18.48533], [105, 18.67358], [105.5, 18.86511], [106, 19.05991], [106.5, 19.25771], [107, 19.45914], [107.5, 19.66383],
                   [108, 19.87227], [108.5, 20.08383], [109, 20.29904], [109.5, 20.51753], [110, 20.73907] ]
            },
            {
              name: "75th",
              type: "area",
              data: [[45, 2.617102], [45.5, 2.707579], [46, 2.797955], [46.5, 2.888316], [47, 2.979021], [47.5, 3.070581], [48, 3.163636],
               [48.5, 3.25893], [49, 3.357314], [49.5, 3.459533], [50, 3.565801], [50.5, 3.676436], [51, 3.791333], [51.5, 3.910385], 
               [52, 4.033622], [52.5, 4.160775], [53, 4.291447], [53.5, 4.425561], [54, 4.562313], [54.5, 4.701201], [55, 4.841693], 
               [55.5, 4.983257], [56, 5.125467], [56.5, 5.267968], [57, 5.410406], [57.5, 5.552707], [58, 5.694762], [58.5, 5.836075], 
               [59, 5.976328], [59.5, 6.115053], [60, 6.252183], [60.5, 6.387612], [61, 6.521295], [61.5, 6.653335], [62, 6.783883], 
               [62.5, 6.912573], [63, 7.039769], [63.5, 7.165684], [64, 7.290375], [64.5, 7.413783], [65, 7.535964], [65.5, 7.656861], 
               [66, 7.77642], [66.5, 7.894642], [67, 8.011313], [67.5, 8.126699], [68, 8.24053], [68.5, 8.353133], [69, 8.464499], 
               [69.5, 8.574851], [70, 8.684179], [70.5, 8.792433], [71, 8.90004], [71.5, 9.007106], [72, 9.113356], [72.5, 9.218809], 
               [73, 9.323402], [73.5, 9.426922], [74, 9.52888], [74.5, 9.629617], [75, 9.728897], [75.5, 9.827172], [76, 9.924413], 
               [76.5, 10.02122], [77, 10.11798], [77.5, 10.2153], [78, 10.31357], [78.5, 10.41328], [79, 10.51461], [79.5, 10.61803], 
               [80, 10.72377], [80.5, 10.83227], [81, 10.94331], [81.5, 11.05729], [82, 11.1737], [82.5, 11.29274], [83, 11.41431], 
               [83.5, 11.53812], [84, 11.66423], [84.5, 11.79224], [85, 11.92214], [85.5, 12.0535], [86, 12.18605], [86.5, 12.31951],
                [87, 12.4535], [87.5, 12.58739], [88, 12.72125], [88.5, 12.85489], [89, 12.98821], [89.5, 13.1211], [90, 13.25378], 
                [90.5, 13.38604], [91, 13.51818], [91.5, 13.65022], [92, 13.78226], [92.5, 13.91442], [93, 14.04658], [93.5, 14.17916], 
                [94, 14.31208], [94.5, 14.44555], [95, 14.57965], [95.5, 14.71473], [96, 14.85046], [96.5, 14.98716], [97, 15.12494],
                 [97.5, 15.26402], [98, 15.4046], [98.5, 15.54691], [99, 15.69116], [99.5, 15.83756], [100, 15.98621], [100.5, 16.13767], 
                 [101, 16.29149], [101.5, 16.44801], [102, 16.60744], [102.5, 16.76944], [103, 16.93459], [103.5, 17.10221], [104, 17.27275], 
                 [104.5, 17.446], [105, 17.62184], [105.5, 17.80061], [106, 17.98231], [106.5, 18.16692], [107, 18.35478], [107.5, 18.54568], 
                 [108, 18.73995], [108.5, 18.93723], [109, 19.13778], [109.5, 19.34137], [110, 19.54779] ]
            },
            {
              name: "50th",
              type: "area",
              data: [[45, 2.4607], [45.5, 2.5457], [46, 2.6306], [46.5, 2.7155], [47, 2.8007], [47.5, 2.8867], [48, 2.9741], 
              [48.5, 3.0636], [49, 3.156], [49.5, 3.252], [50, 3.3518], [50.5, 3.4557], [51, 3.5636], [51.5, 3.6754], [52, 3.7911], 
              [52.5, 3.9105], [53, 4.0332], [53.5, 4.1591], [54, 4.2875], [54.5, 4.4179], [55, 4.5498], [55.5, 4.6827], [56, 4.8162], 
              [56.5, 4.95], [57, 5.0837], [57.5, 5.2173], [58, 5.3507], [58.5, 5.4834], [59, 5.6151], [59.5, 5.7454], [60, 5.8742], 
              [60.5, 6.0014], [61, 6.127], [61.5, 6.2511], [62, 6.3738], [62.5, 6.4948], [63, 6.6144], [63.5, 6.7328], [64, 6.8501], 
              [64.5, 6.9662], [65, 7.0812], [65.5, 7.195], [66, 7.3076], [66.5, 7.4189], [67, 7.5288], [67.5, 7.6375], [68, 7.7448],
               [68.5, 7.8509], [69, 7.9559], [69.5, 8.0599], [70, 8.163], [70.5, 8.2651], [71, 8.3666], [71.5, 8.4676], [72, 8.5679],
                [72.5, 8.6674], [73, 8.7661], [73.5, 8.8638], [74, 8.9601], [74.5, 9.0552], [75, 9.149], [75.5, 9.2418], [76, 9.3337], 
                [76.5, 9.4252], [77, 9.5166], [77.5, 9.6086], [78, 9.7015], [78.5, 9.7957], [79, 9.8915], [79.5, 9.9892], [80, 10.0891],
                 [80.5, 10.1916], [81, 10.2965], [81.5, 10.4041], [82, 10.514], [82.5, 10.6263], [83, 10.741], [83.5, 10.8578], 
                 [84, 10.9767], [84.5, 11.0974], [85, 11.2198], [85.5, 11.3435], [86, 11.4684], [86.5, 11.594], [87, 11.7201], 
                 [87.5, 11.8461], [88, 11.972], [88.5, 12.0976], [89, 12.2229], [89.5, 12.3477], [90, 12.4723], [90.5, 12.5965], 
                 [91, 12.7205], [91.5, 12.8443], [92, 12.9681], [92.5, 13.092], [93, 13.2158], [93.5, 13.3399], [94, 13.4643], 
                 [94.5, 13.5892], [95, 13.7146], [95.5, 13.8408], [96, 13.9676], [96.5, 14.0953], [97, 14.2239], [97.5, 14.3537],
                  [98, 14.4848], [98.5, 14.6174], [99, 14.7519], [99.5, 14.8882], [100, 15.0267], [100.5, 15.1676], [101, 15.3108],
                   [101.5, 15.4564], [102, 15.6046], [102.5, 15.7553], [103, 15.9087], [103.5, 16.0645], [104, 16.2229], [104.5, 16.3837],
                    [105, 16.547], [105.5, 16.7129], [106, 16.8814], [106.5, 17.0527], [107, 17.2269], [107.5, 17.4039], [108, 17.5839],
                     [108.5, 17.7668], [109, 17.9526], [109.5, 18.1412], [110, 18.3324] ]
            },
            {
              name: "25th",
              type: "area",
              data: [[45, 2.316937], [45.5, 2.396908], [46, 2.47678], [46.5, 2.556665], [47, 2.636812], [47.5, 2.717708], [48, 2.799918],
               [48.5, 2.8841], [49, 2.971008], [49.5, 3.0613], [50, 3.155165], [50.5, 3.252884], [51, 3.354363], [51.5, 3.459507], 
               [52, 3.568293], [52.5, 3.680579], [53, 3.795965], [53.5, 3.91433], [54, 4.035067], [54.5, 4.15768], [55, 4.281698], 
               [55.5, 4.406651], [56, 4.532161], [56.5, 4.657978], [57, 4.783665], [57.5, 4.909283], [58, 5.034741], [58.5, 5.159537],
                [59, 5.283389], [59.5, 5.405955], [60, 5.527109], [60.5, 5.646756], [61, 5.764934], [61.5, 5.881739], [62, 5.997229],
                 [62.5, 6.111161], [63, 6.223778], [63.5, 6.335269], [64, 6.445771], [64.5, 6.555148], [65, 6.663537], [65.5, 6.770804], 
                 [66, 6.876992], [66.5, 6.981917], [67, 7.085578], [67.5, 7.188115], [68, 7.28939], [68.5, 7.389495], [69, 7.48862],
                  [69.5, 7.586761], [70, 7.684113], [70.5, 7.780531], [71, 7.876392], [71.5, 7.971789], [72, 8.066588], [72.5, 8.160589],
                   [73, 8.253844], [73.5, 8.346165], [74, 8.437231], [74.5, 8.527118], [75, 8.615846], [75.5, 8.703582], [76, 8.790535], 
                   [76.5, 8.87712], [77, 8.96356], [77.5, 9.050631], [78, 9.138558], [78.5, 9.227657], [79, 9.318332], [79.5, 9.410743],
                    [80, 9.505233], [80.5, 9.602181], [81, 9.701398], [81.5, 9.803103], [82, 9.906981], [82.5, 10.01306], [83, 10.12141],
                     [83.5, 10.23174], [84, 10.34399], [84.5, 10.45794], [85, 10.57343], [85.5, 10.69007], [86, 10.80792], [86.5, 10.92628], 
                     [87, 11.04512], [87.5, 11.16387], [88, 11.28244], [88.5, 11.40066], [89, 11.51859], [89.5, 11.63596], [90, 11.75315], 
                     [90.5, 11.86995], [91, 11.98649], [91.5, 12.10274], [92, 12.21899], [92.5, 12.33533], [93, 12.45148], [93.5, 12.56782],
                      [94, 12.68444], [94.5, 12.80151], [95, 12.91896], [95.5, 13.03707], [96, 13.15572], [96.5, 13.27521], [97, 13.39545],
                       [97.5, 13.5168], [98, 13.63927], [98.5, 13.76304], [99, 13.88867], [99.5, 14.01579], [100, 14.14506], [100.5, 14.27637], 
                       [101, 14.40992], [101.5, 14.54561], [102, 14.68363], [102.5, 14.82407], [103, 14.96682], [103.5, 15.11191], [104, 15.2593],
                        [104.5, 15.40883], [105, 15.56077], [105.5, 15.71502], [106, 15.87158], [106.5, 16.03084], [107, 16.19268], [107.5, 16.35711], 
                        [108, 16.52422], [108.5, 16.69412], [109, 16.86659], [109.5, 17.04165], [110, 17.2191] ]
            },
            {
              name: "10th",
              type: "area",
              data: [[45, 2.197295], [45.5, 2.273085], [46, 2.348778], [46.5, 2.424493], [47, 2.50044], [47.5, 2.577093], [48, 2.654989],
               [48.5, 2.734752], [49, 2.817095], [49.5, 2.902644], [50, 2.991576], [50.5, 3.084158], [51, 3.180301], [51.5, 3.279915], 
               [52, 3.382958], [52.5, 3.489332], [53, 3.598641], [53.5, 3.710748], [54, 3.825119], [54.5, 3.941262], [55, 4.058733],
                [55.5, 4.177084], [56, 4.295958], [56.5, 4.415143], [57, 4.534174], [57.5, 4.653161], [58, 4.772019], [58.5, 4.890248], 
                [59, 5.007579], [59.5, 5.123718], [60, 5.238517], [60.5, 5.351886], [61, 5.463893], [61.5, 5.574631], [62, 5.684122], 
                [62.5, 5.792171], [63, 5.898977], [63.5, 6.004718], [64, 6.109558], [64.5, 6.213336], [65, 6.316217], [65.5, 6.418038], 
                [66, 6.518879], [66.5, 6.618491], [67, 6.716946], [67.5, 6.814342], [68, 6.910586], [68.5, 7.005688], [69, 7.099906], 
                [69.5, 7.193158], [70, 7.285707], [70.5, 7.377377], [71, 7.468525], [71.5, 7.559241], [72, 7.649438], [72.5, 7.738841], 
                [73, 7.827544], [73.5, 7.915366], [74, 8.002049], [74.5, 8.087576], [75, 8.172055], [75.5, 8.255554], [76, 8.338363], 
                [76.5, 8.420829], [77, 8.503115], [77.5, 8.586055], [78, 8.669814], [78.5, 8.754641], [79, 8.841019], [79.5, 8.929001],
                 [80, 9.018962], [80.5, 9.111262], [81, 9.20572], [81.5, 9.302492], [82, 9.401333], [82.5, 9.502215], [83, 9.605253], 
                 [83.5, 9.71018], [84, 9.816874], [84.5, 9.925186], [85, 10.0349], [85.5, 10.14566], [86, 10.25763], [86.5, 10.36997], 
                 [87, 10.48275], [87.5, 10.59545], [88, 10.70793], [88.5, 10.82], [89, 10.9318], [89.5, 11.04301], [90, 11.15403], 
                 [90.5, 11.26469], [91, 11.37502], [91.5, 11.48502], [92, 11.59501], [92.5, 11.70507], [93, 11.81489], [93.5, 11.92481],
                  [94, 12.03498], [94.5, 12.14557], [95, 12.25645], [95.5, 12.36787], [96, 12.47979], [96.5, 12.5925], [97, 12.70583], 
                  [97.5, 12.8202], [98, 12.93555], [98.5, 13.05204], [99, 13.17036], [99.5, 13.28993], [100, 13.41159], [100.5, 13.53502],
                   [101, 13.66063], [101.5, 13.78817], [102, 13.91781], [102.5, 14.04981], [103, 14.18382], [103.5, 14.32009],
                    [104, 14.45845], [104.5, 14.59872], [105, 14.74134], [105.5, 14.88603], [106, 15.03279], [106.5, 15.18217], 
                    [107, 15.33388], [107.5, 15.48801], [108, 15.64456], [108.5, 15.8038], [109, 15.96535], [109.5, 16.12932], [110, 16.29552] ]
            },
            {
              name: "5th",
              type: "area",
              data: [[45, 2.129751], [45.5, 2.203182], [46, 2.276517], [46.5, 2.34988], [47, 2.423458], [47.5, 2.497718], [48, 2.573181], 
              [48.5, 2.650451], [49, 2.730221], [49.5, 2.813094], [50, 2.899244], [50.5, 2.98893], [51, 3.082063], [51.5, 3.178559], 
              [52, 3.278363], [52.5, 3.381404], [53, 3.487286], [53.5, 3.595865], [54, 3.706646], [54.5, 3.819142], [55, 3.932921], 
              [55.5, 4.04755], [56, 4.162683], [56.5, 4.278128], [57, 4.393408], [57.5, 4.508656], [58, 4.623793], [58.5, 4.738318], 
              [59, 4.851972], [59.5, 4.964486], [60, 5.075701], [60.5, 5.185529], [61, 5.294055], [61.5, 5.401368], [62, 5.507474], 
              [62.5, 5.612202], [63, 5.715727], [63.5, 5.818222], [64, 5.919864], [64.5, 6.020479], [65, 6.120247], [65.5, 6.218991], 
              [66, 6.316808], [66.5, 6.413417], [67, 6.508928], [67.5, 6.603417], [68, 6.696814], [68.5, 6.789085], [69, 6.880527], 
              [69.5, 6.971011], [70, 7.060842], [70.5, 7.149824], [71, 7.238303], [71.5, 7.326367], [72, 7.413956], [72.5, 7.500756], 
              [73, 7.586879], [73.5, 7.672153], [74, 7.756351], [74.5, 7.839407], [75, 7.921476], [75.5, 8.002572], [76, 8.08303], 
              [76.5, 8.163159], [77, 8.24309], [77.5, 8.323686], [78, 8.405079], [78.5, 8.487483], [79, 8.571423], [79.5, 8.656893], 
              [80, 8.744286], [80.5, 8.833949], [81, 8.925709], [81.5, 9.019686], [82, 9.115672], [82.5, 9.21361], [83, 9.313642], 
              [83.5, 9.415507], [84, 9.519058], [84.5, 9.624179], [85, 9.730633], [85.5, 9.838068], [86, 9.946702], [86.5, 10.05564], 
              [87, 10.16501], [87.5, 10.27429], [88, 10.38332], [88.5, 10.49193], [89, 10.60026], [89.5, 10.708], [90, 10.81555], 
              [90.5, 10.92274], [91, 11.02957], [91.5, 11.13605], [92, 11.24251], [92.5, 11.34904], [93, 11.45529], [93.5, 11.56159], 
              [94, 11.66814], [94.5, 11.77509], [95, 11.88227], [95.5, 11.98993], [96, 12.09808], [96.5, 12.20698], [97, 12.31643], 
              [97.5, 12.42689], [98, 12.53825], [98.5, 12.65066], [99, 12.76488], [99.5, 12.88022], [100, 12.99761], [100.5, 13.11663],
               [101, 13.23779], [101.5, 13.36076], [102, 13.48572], [102.5, 13.613], [103, 13.74212], [103.5, 13.87346], [104, 14.00677], 
               [104.5, 14.14187], [105, 14.27927], [105.5, 14.41863], [106, 14.55992], [106.5, 14.70378], [107, 14.84983], [107.5, 14.99821],
                [108, 15.14886], [108.5, 15.30215], [109, 15.45761], [109.5, 15.61539], [110, 15.77532] ]
            },
            {
              name: "2nd",
              type: "area",
              data: [[45, 2.066469], [45.5, 2.137691], [46, 2.208818], [46.5, 2.279978], [47, 2.351337], [47.5, 2.423357], [48, 2.496542],
               [48.5, 2.571479], [49, 2.648838], [49.5, 2.729207], [50, 2.812752], [50.5, 2.899726], [51, 2.990043], [51.5, 3.083618], 
               [52, 3.180391], [52.5, 3.280312], [53, 3.382985], [53.5, 3.488262], [54, 3.595683], [54.5, 3.704765], [55, 3.815089], 
               [55.5, 3.926234], [56, 4.037866], [56.5, 4.14981], [57, 4.261578], [57.5, 4.373328], [58, 4.484981], [58.5, 4.596039], 
               [59, 4.70625], [59.5, 4.81537], [60, 4.923229], [60.5, 5.029742], [61, 5.135007], [61.5, 5.239112], [62, 5.342048], 
               [62.5, 5.443665], [63, 5.544116], [63.5, 5.643569], [64, 5.742214], [64.5, 5.839864], [65, 5.936714], [65.5, 6.032572], 
               [66, 6.127553], [66.5, 6.221346], [67, 6.314096], [67.5, 6.405857], [68, 6.496582], [68.5, 6.586198], [69, 6.675032], 
               [69.5, 6.762921], [70, 6.850199], [70.5, 6.936657], [71, 7.022631], [71.5, 7.108205], [72, 7.193344], [72.5, 7.277698], 
               [73, 7.361399], [73.5, 7.444278], [74, 7.526142], [74.5, 7.606876], [75, 7.68668], [75.5, 7.765519], [76, 7.843766], 
               [76.5, 7.921697], [77, 7.999415], [77.5, 8.077806], [78, 8.156974], [78.5, 8.237102], [79, 8.318749], [79.5, 8.401858], 
               [80, 8.486836], [80.5, 8.574021], [81, 8.663244], [81.5, 8.754596], [82, 8.8479], [82.5, 8.943074], [83, 9.040282], 
               [83.5, 9.139273], [84, 9.239873], [84.5, 9.341999], [85, 9.445392], [85.5, 9.549707], [86, 9.655218], [86.5, 9.76096], 
               [87, 9.867124], [87.5, 9.973203], [88, 10.07901], [88.5, 10.18437], [89, 10.28947], [89.5, 10.39394], [90, 10.49824], 
               [90.5, 10.60218], [91, 10.70575], [91.5, 10.80893], [92, 10.91209], [92.5, 11.01532], [93, 11.11823], [93.5, 11.22116], 
               [94, 11.32432], [94.5, 11.42787], [95, 11.5316], [95.5, 11.63575], [96, 11.74037], [96.5, 11.84572], [97, 11.95156], 
               [97.5, 12.05836], [98, 12.166], [98.5, 12.27461], [99, 12.38501], [99.5, 12.4964], [100, 12.60982], [100.5, 12.72473], 
               [101, 12.84174], [101.5, 12.96047], [102, 13.08107], [102.5, 13.20394], [103, 13.32851], [103.5, 13.45527], [104, 13.58388],
                [104.5, 13.71417], [105, 13.84672], [105.5, 13.98111], [106, 14.11732], [106.5, 14.25605], [107, 14.39684], 
                [107.5, 14.53987], [108, 14.68504], [108.5, 14.83281], [109, 14.98261], [109.5, 15.13464], [110, 15.28873] ]
            },
            {
              name: "<2nd",
              type: "area",
              data: [[45, 0.066469], [45.5, 0.137691], [46, 0.208818], [46.5, 0.279978], [47, 0.351337], [47.5, 0.423357], 
              [48, 0.496542], [48.5, 0.571479], [49, 0.648838], [49.5, 0.729207], [50, 0.812752], [50.5, 0.899726], [51, 0.990043], 
              [51.5, 1.083618], [52, 1.180391], [52.5, 1.280312], [53, 1.382985], [53.5, 1.488262], [54, 1.595683], [54.5, 1.704765], 
              [55, 1.815089], [55.5, 1.926234], [56, 2.037866], [56.5, 2.14981], [57, 2.261578], [57.5, 2.373328], [58, 2.484981], 
              [58.5, 2.596039], [59, 2.70625], [59.5, 2.81537], [60, 2.923229], [60.5, 3.029742], [61, 3.135007], [61.5, 3.239112], 
              [62, 3.342048], [62.5, 3.443665], [63, 3.544116], [63.5, 3.643569], [64, 3.742214], [64.5, 3.839864], [65, 3.936714], 
              [65.5, 4.032572], [66, 4.127553], [66.5, 4.221346], [67, 4.314096], [67.5, 4.405857], [68, 4.496582], [68.5, 4.586198], 
              [69, 4.675032], [69.5, 4.762921], [70, 4.850199], [70.5, 4.936657], [71, 5.022631], [71.5, 5.108205], [72, 5.193344], 
              [72.5, 5.277698], [73, 5.361399], [73.5, 5.444278], [74, 5.526142], [74.5, 5.606876], [75, 5.68668], [75.5, 5.765519], 
              [76, 5.843766], [76.5, 5.921697], [77, 5.999415], [77.5, 6.077806], [78, 6.156974], [78.5, 6.237102], [79, 6.318749], 
              [79.5, 6.401858], [80, 6.486836], [80.5, 6.574021], [81, 6.663244], [81.5, 6.754596], [82, 6.8479], [82.5, 6.943074], 
              [83, 7.040282], [83.5, 7.139273], [84, 7.239873], [84.5, 7.341999], [85, 7.445392], [85.5, 7.549707], [86, 7.655218], 
              [86.5, 7.76096], [87, 7.867124], [87.5, 7.973203], [88, 8.07901], [88.5, 8.18437], [89, 8.28947], [89.5, 8.39394], 
              [90, 8.49824], [90.5, 8.60218], [91, 8.70575], [91.5, 8.80893], [92, 8.91209], [92.5, 9.01532], [93, 9.11823], 
              [93.5, 9.22116], [94, 9.32432], [94.5, 9.42787], [95, 9.5316], [95.5, 9.63575], [96, 9.74037], [96.5, 9.84572], 
              [97, 9.95156], [97.5, 10.05836], [98, 10.166], [98.5, 10.27461], [99, 10.38501], [99.5, 10.4964], [100, 10.60982], 
              [100.5, 10.72473], [101, 10.84174], [101.5, 10.96047], [102, 11.08107], [102.5, 11.20394], [103, 11.32851], 
              [103.5, 11.45527], [104, 11.58388], [104.5, 11.71417], [105, 11.84672], [105.5, 11.98111], [106, 12.11732], 
              [106.5, 12.25605], [107, 12.39684], [107.5, 12.53987], [108, 12.68504], [108.5, 12.83281], [109, 12.98261], 
              [109.5, 13.13464], [110, 13.28873] ]
            }
    
          ],
          chart: {
            offsetX: 50,
            offsetY: 100,
            height: 700,
            width: 1000,
            type: "line"
          },
          grid: {
            show: false
          },
          stroke: {
            show: true,
            curve: "straight",
            colors: ["#000"],
            width: [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          },
          legend: {
            show: false,
            position: "right"
          },
          fill: {
            type: "solid",
            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            // white, red, yellow, yellow, green, green, green, green, green, yellow, yellow, red, white
            colors: ["#ffffff", "#cc0404", "#fae102", "#fae102", "#1da302", "#1da302", "#1da302", "#1da302", "#fae102", "#fae102", "#cc0404", "#ffffff"]
    
          },
          markers: {
            size: [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            colors: ['#000', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
            strokeColors: '#000',
            strokeWidth: 2,
            strokeOpacity: 0.5,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
              size: undefined,
              sizeOffset: 3
            }
          },
          yaxis: [
            {
              show: true,
              tickAmount: 10,
              labels: {
                show: true,
                align: 'right',
                minWidth: 0,
                maxWidth: 4,
                style: {
                  colors: [],
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-yaxis-label',
                },
                offsetX: 0,
                offsetY: 0,
                rotate: 0
              },
              title: {
                text: "Weight",
                rotate: -90,
                offsetX: 50,
                offsetY: 50,
                style: {
                  color: "000",
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-yaxis-title',
                }
                // forceNiceScale: true
              }
            }
          ],
          xaxis: {
            labels: {
              show: true,
              style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
              },
              offsetX: 0,
              offsetY: 0,
              rotate: 0
            },
            title: {
              text: "Length",
              offsetX: 0,
              offsetY: 0,
              style: {
                color: "000",
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-title',
              }
            },
            type: 'numeric',
            tickAmount: 10,
          },
          tooltip: {
            shared: true,
            intersect: false,
            x: {
              formatter: function (x) {
                if (typeof x !== "undefined") {
                  return x.toFixed(0) + " cm";
                }
                return x;
              }
            },
            y: {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(0) + " kg";
                }
                return y;
              }
            }
          }
        };

        break;

      case (Gender.Male):
        this.chartOptions = {
          series: [
            {
              name: "Baby",
              type: "line",
              data: babyData
            },
            {
              name: ">98th",
              type: "area",
              // Values for boys
              data: [ [45, 4.951324], [45.5, 5.050268], [46, 5.148968], [46.5, 5.247837], [47, 5.347375], [47.5, 5.448234], [48, 5.551015], [48.5, 5.65672], 
              [49, 5.76646], [49.5, 5.880511], [50, 5.998505], [50.5, 6.120075], [51, 6.245244], [51.5, 6.374568], [52, 6.50876], 
              [52.5, 6.648887], [53, 6.795059], [53.5, 6.946784], [54, 7.103693], [54.5, 7.264463], [55, 7.428484], [55.5, 7.595166], 
              [56, 7.764267], [56.5, 7.934596], [57, 8.105576], [57.5, 8.276246], [58, 8.446507], [58.5, 8.615894], [59, 8.784063], [59.5, 8.950579], 
              [60, 9.114604], [60.5, 9.275354], [61, 9.432856], [61.5, 9.587165], [62, 9.738897], [62.5, 9.888055], [63, 10.035457], 
              [63.5, 10.180948], [64, 10.324777], [64.5, 10.467133], [65, 10.608089], [65.5, 10.747892], [66, 10.887095], [66.5, 11.025525],
               [67, 11.16319], [67.5, 11.300099], [68, 11.436461], [68.5, 11.572124], [69, 11.707649], [69.5, 11.843373], [70, 11.978888],
                [70.5, 12.11417], [71, 12.24843], [71.5, 12.38198], [72, 12.51406], [72.5, 12.64519], [73, 12.77448], [73.5, 12.90203], 
                [74, 13.02784], [74.5, 13.15214], [75, 13.27481], [75.5, 13.39598], [76, 13.51515], [76.5, 13.63173], [77, 13.74594],
                 [77.5, 13.85814], [78, 13.96819], [78.5, 14.07668], [79, 14.18395], [79.5, 14.29106], [80, 14.39858], [80.5, 14.50708], 
                 [81, 14.61731], [81.5, 14.72995], [82, 14.84545], [82.5, 14.96389], [83, 15.08626], [83.5, 15.21254], [84, 15.34249], 
                 [84.5, 15.47573], [85, 15.61171], [85.5, 15.74978], [86, 15.88953], [86.5, 16.0304], [87, 16.17165], [87.5, 16.31317], 
                 [88, 16.45419], [88.5, 16.59437], [89, 16.73404], [89.5, 16.87278], [90, 17.01124], [90.5, 17.14859], [91, 17.28616], 
                 [91.5, 17.42324], [92, 17.5607], [92.5, 17.69813], [93, 17.83577], [93.5, 17.97422], [94, 18.11372], [94.5, 18.25431], 
                 [95, 18.39622], [95.5, 18.54005], [96, 18.68618], [96.5, 18.83404], [97, 18.98528], [97.5, 19.13875], [98, 19.29563], 
                 [98.5, 19.45536], [99, 19.61818], [99.5, 19.78436], [100, 19.95354], [100.5, 20.12551], [101, 20.3004], [101.5, 20.47798],
                  [102, 20.65839], [102.5, 20.84113], [103, 21.0266], [103.5, 21.2147], [104, 21.40491], [104.5, 21.59777], [105, 21.79277],
                   [105.5, 21.99014], [106, 22.19019], [106.5, 22.39275], [107, 22.5977], [107.5, 22.80594], [108, 23.01615], 
                   [108.5, 23.22947], [109, 23.44557], [109.5, 23.66518], [110, 23.88782] ]
            },
            {
              name: "98th",
              type: "area",
              data: [ [45, 2.951324], [45.5, 3.050268], [46, 3.148968], [46.5, 3.247837], [47, 3.347375], [47.5, 3.448234], 
              [48, 3.551015], [48.5, 3.65672], [49, 3.76646], [49.5, 3.880511], [50, 3.998505], [50.5, 4.120075], [51, 4.245244], 
              [51.5, 4.374568], [52, 4.50876], [52.5, 4.648887], [53, 4.795059], [53.5, 4.946784], [54, 5.103693], [54.5, 5.264463], 
              [55, 5.428484], [55.5, 5.595166], [56, 5.764267], [56.5, 5.934596], [57, 6.105576], [57.5, 6.276246], [58, 6.446507],
               [58.5, 6.615894], [59, 6.784063], [59.5, 6.950579], [60, 7.114604], [60.5, 7.275354], [61, 7.432856], [61.5, 7.587165], 
               [62, 7.738897], [62.5, 7.888055], [63, 8.035457], [63.5, 8.180948], [64, 8.324777], [64.5, 8.467133], [65, 8.608089], 
               [65.5, 8.747892], [66, 8.887095], [66.5, 9.025525], [67, 9.16319], [67.5, 9.300099], [68, 9.436461], [68.5, 9.572124], 
               [69, 9.707649], [69.5, 9.843373], [70, 9.978888], [70.5, 10.11417], [71, 10.24843], [71.5, 10.38198], [72, 10.51406], 
               [72.5, 10.64519], [73, 10.77448], [73.5, 10.90203], [74, 11.02784], [74.5, 11.15214], [75, 11.27481], [75.5, 11.39598],
                [76, 11.51515], [76.5, 11.63173], [77, 11.74594], [77.5, 11.85814], [78, 11.96819], [78.5, 12.07668], [79, 12.18395], 
                [79.5, 12.29106], [80, 12.39858], [80.5, 12.50708], [81, 12.61731], [81.5, 12.72995], [82, 12.84545], [82.5, 12.96389], 
                [83, 13.08626], [83.5, 13.21254], [84, 13.34249], [84.5, 13.47573], [85, 13.61171], [85.5, 13.74978], [86, 13.88953], 
                [86.5, 14.0304], [87, 14.17165], [87.5, 14.31317], [88, 14.45419], [88.5, 14.59437], [89, 14.73404], [89.5, 14.87278], 
                [90, 15.01124], [90.5, 15.14859], [91, 15.28616], [91.5, 15.42324], [92, 15.5607], [92.5, 15.69813], [93, 15.83577],
                 [93.5, 15.97422], [94, 16.11372], [94.5, 16.25431], [95, 16.39622], [95.5, 16.54005], [96, 16.68618], [96.5, 16.83404], 
                 [97, 16.98528], [97.5, 17.13875], [98, 17.29563], [98.5, 17.45536], [99, 17.61818], [99.5, 17.78436], [100, 17.95354], 
                 [100.5, 18.12551], [101, 18.3004], [101.5, 18.47798], [102, 18.65839], [102.5, 18.84113], [103, 19.0266], [103.5, 19.2147],
                  [104, 19.40491], [104.5, 19.59777], [105, 19.79277], [105.5, 19.99014], [106, 20.19019], [106.5, 20.39275], [107, 20.5977],
                   [107.5, 20.80594], [108, 21.01615], [108.5, 21.22947], [109, 21.44557], [109.5, 21.66518], [110, 21.88782] ]
            },
            {
              name: "95th",
              type: "area",
              data: [[45, 2.850807], [45.5, 2.946724], [46, 3.042427], [46.5, 3.138329], [47, 3.234886], [47.5, 3.332742], 
              [48, 3.43248], [48.5, 3.53508], [49, 3.641592], [49.5, 3.752297], [50, 3.86684], [50.5, 3.984869], [51, 4.106421],
               [51.5, 4.232023], [52, 4.362364], [52.5, 4.49848], [53, 4.640477], [53.5, 4.787883], [54, 4.940342], [54.5, 5.096575], 
               [55, 5.255972], [55.5, 5.417981], [56, 5.582349], [56.5, 5.747942], [57, 5.914155], [57.5, 6.080102], [58, 6.245662], 
               [58.5, 6.410382], [59, 6.573927], [59.5, 6.735847], [60, 6.89535], [60.5, 7.05165], [61, 7.204766], [61.5, 7.354806], 
               [62, 7.502278], [62.5, 7.647269], [63, 7.79051], [63.5, 7.931881], [64, 8.071618], [64.5, 8.209873], [65, 8.346744],
                [65.5, 8.482471], [66, 8.617553], [66.5, 8.751853], [67, 8.885379], [67.5, 9.018137], [68, 9.150293], [68.5, 9.281768],
                 [69, 9.413071], [69.5, 9.544487], [70, 9.675696], [70.5, 9.806637], [71, 9.936572], [71.5, 10.06579], [72, 10.19359], 
                 [72.5, 10.3204], [73, 10.44546], [73.5, 10.56882], [74, 10.69049], [74.5, 10.81073], [75, 10.92939], [75.5, 11.04658], 
                 [76, 11.16183], [76.5, 11.27465], [77, 11.38522], [77.5, 11.49384], [78, 11.60047], [78.5, 11.70563], [79, 11.80969], 
                 [79.5, 11.91365], [80, 12.0181], [80.5, 12.12362], [81, 12.23085], [81.5, 12.34049], [82, 12.45299], [82.5, 12.56846], 
                 [83, 12.6878], [83.5, 12.811], [84, 12.93781], [84.5, 13.06789], [85, 13.20064], [85.5, 13.3355], [86, 13.47199],
                  [86.5, 13.60955], [87, 13.74748], [87.5, 13.88559], [88, 14.02317], [88.5, 14.1599], [89, 14.29604], [89.5, 14.43122],
                   [90, 14.56597], [90.5, 14.69965], [91, 14.83338], [91.5, 14.96664], [92, 15.10008], [92.5, 15.23344], [93, 15.36695],
                    [93.5, 15.50112], [94, 15.63618], [94.5, 15.77223], [95, 15.90949], [95.5, 16.04848], [96, 16.18957], [96.5, 16.33231],
                     [97, 16.47814], [97.5, 16.6261], [98, 16.77723], [98.5, 16.93104], [99, 17.08775], [99.5, 17.24756], [100, 17.41019], 
                     [100.5, 17.57543], [101, 17.74339], [101.5, 17.91387], [102, 18.08698], [102.5, 18.26231], [103, 18.44018], 
                     [103.5, 18.62048], [104, 18.8028], [104.5, 18.98757], [105, 19.17436], [105.5, 19.36341], [106, 19.55494], 
                     [106.5, 19.74885], [107, 19.94503], [107.5, 20.14419], [108, 20.34528], [108.5, 20.54925], [109, 20.75587], 
                     [109.5, 20.96574], [110, 21.1785]  ]
            },
            {
              name: "90th",
              type: "area",
              data: [[45, 2.752713], [45.5, 2.84566], [46, 2.938422], [46.5, 3.031408], [47, 3.125038], 
              [47.5, 3.219945], [48, 3.316691], [48.5, 3.41624], [49, 3.519578], [49.5, 3.626994], [50, 3.738145], [50.5, 3.852691],
               [51, 3.970687], [51.5, 4.092626], [52, 4.219179], [52.5, 4.351347], [53, 4.489236], [53.5, 4.632391], [54, 4.78047], 
               [54.5, 4.932235], [55, 5.08708], [55.5, 5.244488], [56, 5.404194], [56.5, 5.565121], [57, 5.726639], [57.5, 5.887933],
                [58, 6.048861], [58.5, 6.208982], [59, 6.36797], [59.5, 6.52536], [60, 6.68041], [60.5, 6.832326], [61, 6.981122], 
                [61.5, 7.126957], [62, 7.270234], [62.5, 7.411123], [63, 7.55027], [63.5, 7.687586], [64, 7.823298], [64.5, 7.95752], 
                [65, 8.090377], [65.5, 8.222098], [66, 8.353132], [66.5, 8.483379], [67, 8.612843], [67.5, 8.741529], [68, 8.869561],
                 [68.5, 8.996931], [69, 9.124096], [69.5, 9.251294], [70, 9.378287], [70.5, 9.504978], [71, 9.630686], [71.5, 9.755654], 
                 [72, 9.879288], [72.5, 10.00187], [73, 10.12279], [73.5, 10.24205], [74, 10.35967], [74.5, 10.47594], [75, 10.59067], 
                 [75.5, 10.70398], [76, 10.8154], [76.5, 10.92455], [77, 11.03155], [77.5, 11.13666], [78, 11.23993], [78.5, 11.34182],
                  [79, 11.44274], [79.5, 11.54361], [80, 11.64505], [80.5, 11.74761], [81, 11.8519], [81.5, 11.95856], [82, 12.06811], 
                  [82.5, 12.18064], [83, 12.29698], [83.5, 12.41712], [84, 12.54083], [84.5, 12.66777], [85, 12.79732], [85.5, 12.92898],
                   [86, 13.06224], [86.5, 13.1965], [87, 13.33114], [87.5, 13.46586], [88, 13.60004], [88.5, 13.73336], [89, 13.86599],
                    [89.5, 13.99766], [90, 14.12875], [90.5, 14.25882], [91, 14.38877], [91.5, 14.51826], [92, 14.64776], [92.5, 14.77713], 
                    [93, 14.90658], [93.5, 15.03655], [94, 15.16726], [94.5, 15.29886], [95, 15.43158], [95.5, 15.56585], [96, 15.70201], 
                    [96.5, 15.83976], [97, 15.9803], [97.5, 16.1229], [98, 16.26843], [98.5, 16.41646], [99, 16.56723], [99.5, 16.72085], 
                    [100, 16.87711], [100.5, 17.03581], [101, 17.19705], [101.5, 17.36062], [102, 17.52665], [102.5, 17.69479], 
                    [103, 17.86529], [103.5, 18.03804], [104, 18.21271], [104.5, 18.38963], [105, 18.56848], [105.5, 18.74947],
                     [106, 18.93274], [106.5, 19.11828], [107, 19.30597], [107.5, 19.49634], [108, 19.68862], [108.5, 19.88356], 
                     [109, 20.081], [109.5, 20.28146], [110, 20.48466]  ]
            },
            {
              name: "75th",
              type: "area",
              data: [ [45, 2.598735], [45.5, 2.686987], [46, 2.775097], [46.5, 2.863471], [47, 2.952467], [47.5, 3.042704], 
              [48, 3.134712], [48.5, 3.229426], [49, 3.327737], [49.5, 3.42994], [50, 3.535715], [50.5, 3.644741], [51, 3.757096], 
              [51.5, 3.873226], [52, 3.993768], [52.5, 4.119672], [53, 4.251043], [53.5, 4.387451], [54, 4.528577], [54.5, 4.67325],
               [55, 4.820865], [55.5, 4.970965], [56, 5.123266], [56.5, 5.276779], [57, 5.430838], [57.5, 5.584736], [58, 5.738301], 
               [58.5, 5.891111], [59, 6.042854], [59.5, 6.193047], [60, 6.341016], [60.5, 6.485965], [61, 6.6279], [61.5, 6.767053], 
               [62, 6.903673], [62.5, 7.038046], [63, 7.170696], [63.5, 7.301578], [64, 7.430906], [64.5, 7.558736], [65, 7.685232], 
               [65.5, 7.810607], [66, 7.935237], [66.5, 8.059071], [67, 8.182112], [67.5, 8.304363], [68, 8.425883], [68.5, 8.546773], 
               [69, 8.667407], [69.5, 8.787957], [70, 8.908303], [70.5, 9.028296], [71, 9.147347], [71.5, 9.265626], [72, 9.382688], 
               [72.5, 9.49862], [73, 9.613018], [73.5, 9.725841], [74, 9.837087], [74.5, 9.947111], [75, 10.05566], [75.5, 10.16285],
                [76, 10.26824], [76.5, 10.3716], [77, 10.47298], [77.5, 10.57257], [78, 10.67054], [78.5, 10.76727], [79, 10.86321], 
                [79.5, 10.95919], [80, 11.05585], [80.5, 11.15373], [81, 11.25332], [81.5, 11.35525], [82, 11.46008], [82.5, 11.56791], 
                [83, 11.67945], [83.5, 11.7947], [84, 11.91343], [84.5, 12.03533], [85, 12.15975], [85.5, 12.28626], [86, 12.41434],
                 [86.5, 12.54331], [87, 12.67267], [87.5, 12.80197], [88, 12.9307], [88.5, 13.05854], [89, 13.18559], [89.5, 13.31166],
                  [90, 13.43693], [90.5, 13.56123], [91, 13.68517], [91.5, 13.80869], [92, 13.93195], [92.5, 14.055], [93, 14.17803], 
                  [93.5, 14.30137], [94, 14.42523], [94.5, 14.54984], [95, 14.67539], [95.5, 14.80223], [96, 14.93065], [96.5, 15.06057],
                   [97, 15.19284], [97.5, 15.32703], [98, 15.46379], [98.5, 15.60279], [99, 15.74427], [99.5, 15.88821], [100, 16.03453],
                    [100.5, 16.18301], [101, 16.33376], [101.5, 16.48658], [102, 16.64157], [102.5, 16.79852], [103, 16.95755], 
                    [103.5, 17.11855], [104, 17.2813], [104.5, 17.44604], [105, 17.61253], [105.5, 17.78099], [106, 17.95145], 
                    [106.5, 18.12398], [107, 18.29849], [107.5, 18.47523], [108, 18.65383], [108.5, 18.83476], [109, 19.01798],
                     [109.5, 19.20386], [110, 19.39227] ]
            },
            {
              name: "50th",
              type: "area",
              data: [[45, 2.441], [45.5, 2.5244], [46, 2.6077], [46.5, 2.6913], [47, 2.7755], [47.5, 2.8609], [48, 2.948], [48.5, 3.0377],
               [49, 3.1308], [49.5, 3.2276], [50, 3.3278], [50.5, 3.4311], [51, 3.5376], [51.5, 3.6477], [52, 3.762], 
               [52.5, 3.8814], [53, 4.006], [53.5, 4.1354], [54, 4.2693], [54.5, 4.4066], [55, 4.5467], [55.5, 4.6892], 
               [56, 4.8338], [56.5, 4.9796], [57, 5.1259], [57.5, 5.2721], [58, 5.418], [58.5, 5.5632], [59, 5.7074], [59.5, 5.8501],
                [60, 5.9907], [60.5, 6.1284], [61, 6.2632], [61.5, 6.3954], [62, 6.5251], [62.5, 6.6527], [63, 6.7786], [63.5, 6.9028], 
                [64, 7.0255], [64.5, 7.1467], [65, 7.2666], [65.5, 7.3854], [66, 7.5034], [66.5, 7.6206], [67, 7.737], [67.5, 7.8526], 
                [68, 7.9674], [68.5, 8.0816], [69, 8.1955], [69.5, 8.3092], [70, 8.4227], [70.5, 8.5358], [71, 8.648], [71.5, 8.7594], 
                [72, 8.8697], [72.5, 8.9788], [73, 9.0865], [73.5, 9.1927], [74, 9.2974], [74.5, 9.401], [75, 9.5032], [75.5, 9.6041], 
                [76, 9.7033], [76.5, 9.8007], [77, 9.8963], [77.5, 9.9902], [78, 10.0827], [78.5, 10.1741], [79, 10.2649], [79.5, 10.3558], 
                [80, 10.4475], [80.5, 10.5405], [81, 10.6352], [81.5, 10.7322], [82, 10.8321], [82.5, 10.935], [83, 11.0415], [83.5, 11.1516],
                 [84, 11.2651], [84.5, 11.3817], [85, 11.5007], [85.5, 11.6218], [86, 11.7444], [86.5, 11.8678], [87, 11.9916], [87.5, 12.1152],
                  [88, 12.2382], [88.5, 12.3603], [89, 12.4815], [89.5, 12.6017], [90, 12.7209], [90.5, 12.8392], [91, 12.9569], [91.5, 13.0742],
                   [92, 13.191], [92.5, 13.3075], [93, 13.4239], [93.5, 13.5404], [94, 13.6572], [94.5, 13.7746], [95, 13.8928], [95.5, 14.012],
                    [96, 14.1325], [96.5, 14.2544], [97, 14.3782], [97.5, 14.5038], [98, 14.6316], [98.5, 14.7614], [99, 14.8934], [99.5, 15.0275],
                     [100, 15.1637], [100.5, 15.3018], [101, 15.4419], [101.5, 15.5838], [102, 15.7276], [102.5, 15.8732], [103, 16.0206], 
                     [103.5, 16.1697], [104, 16.3204], [104.5, 16.4728], [105, 16.6268], [105.5, 16.7826], [106, 16.9401], [106.5, 17.0995],
                      [107, 17.2607], [107.5, 17.4237], [108, 17.5885], [108.5, 17.7553], [109, 17.9242], [109.5, 18.0954], [110, 18.2689]  ]
            },
            {
              name: "25th",
              type: "area",
              data: [[45, 2.295939], [45.5, 2.374837], [46, 2.453671], [46.5, 2.532835], [47, 2.612577], [47.5, 2.69348], [48, 2.776015], 
              [48.5, 2.861048], [49, 2.949299], [49.5, 3.04107], [50, 3.13608], [50.5, 3.234048], [51, 3.335092], [51.5, 3.439571], 
              [52, 3.548053], [52.5, 3.661388], [53, 3.779675], [53.5, 3.902538], [54, 4.029697], [54.5, 4.160116], [55, 4.293202], 
              [55.5, 4.428606], [56, 4.566015], [56.5, 4.704609], [57, 4.843662], [57.5, 4.982669], [58, 5.121406], [58.5, 5.259492], 
              [59, 5.39664], [59.5, 5.532339], [60, 5.666051], [60.5, 5.796979], [61, 5.925116], [61.5, 6.05082], [62, 6.174063], 
              [62.5, 6.29534], [63, 6.414944], [63.5, 6.532913], [64, 6.649434], [64.5, 6.764459], [65, 6.87822], [65.5, 6.990901], 
              [66, 7.102739], [66.5, 7.213776], [67, 7.324011], [67.5, 7.43344], [68, 7.542013], [68.5, 7.650014], [69, 7.757678], 
              [69.5, 7.865043], [70, 7.972213], [70.5, 8.078943], [71, 8.184813], [71.5, 8.289862], [72, 8.393916], [72.5, 8.496715], 
              [73, 8.598234], [73.5, 8.698324], [74, 8.796986], [74.5, 8.894657], [75, 8.990996], [75.5, 9.086097], [76, 9.179582], 
              [76.5, 9.27148], [77, 9.361732], [77.5, 9.450372], [78, 9.537811], [78.5, 9.624271], [79, 9.710293], [79.5, 9.796476], 
              [80, 9.88355], [80.5, 9.971992], [81, 10.06212], [81.5, 10.15449], [82, 10.24976], [82.5, 10.34802], [83, 10.44977], 
              [83.5, 10.55502], [84, 10.66357], [84.5, 10.77516], [85, 10.88904], [85.5, 11.00501], [86, 11.12243], [86.5, 11.24056], 
              [87, 11.3591], [87.5, 11.47732], [88, 11.59491], [88.5, 11.7116], [89, 11.8273], [89.5, 11.94199], [90, 12.05551], 
              [90.5, 12.16819], [91, 12.28006], [91.5, 12.39156], [92, 12.50235], [92.5, 12.61276], [93, 12.723], [93.5, 12.83317], 
              [94, 12.94344], [94.5, 13.05418], [95, 13.16559], [95.5, 13.27776], [96, 13.39097], [96.5, 13.50549], [97, 13.62153], 
              [97.5, 13.73924], [98, 13.85884], [98.5, 13.98021], [99, 14.10354], [99.5, 14.22865], [100, 14.35561], [100.5, 14.48425], 
              [101, 14.61464], [101.5, 14.74659], [102, 14.88021], [102.5, 15.01548], [103, 15.15231], [103.5, 15.2906], [104, 15.43035], 
              [104.5, 15.57155], [105, 15.71422], [105.5, 15.85853], [106, 16.00429], [106.5, 16.15179], [107, 16.30093], [107.5, 16.45149], 
              [108, 16.60381], [108.5, 16.75783], [109, 16.91378], [109.5, 17.07172], [110, 17.23176]  ]
            },
            {
              name: "10th",
              type: "area",
              data: [[45, 2.175173], [45.5, 2.250293], [46, 2.325378], [46.5, 2.400814], [47, 2.47681], [47.5, 2.553931], [48, 2.632625], 
              [48.5, 2.713732], [49, 2.797902], [49.5, 2.88544], [50, 2.976081], [50.5, 3.06956], [51, 3.166008], [51.5, 3.26575], 
              [52, 3.369328], [52.5, 3.477551], [53, 3.590514], [53.5, 3.707865], [54, 3.829338], [54.5, 3.953952], [55, 4.081121], 
              [55.5, 4.210535], [56, 4.341875], [56.5, 4.474383], [57, 4.607318], [57.5, 4.740248], [58, 4.872933], [58.5, 5.005008], 
              [59, 5.136198], [59.5, 5.265982], [60, 5.393876], [60.5, 5.519084], [61, 5.641597], [61.5, 5.761815], [62, 5.87961], 
              [62.5, 5.99555], [63, 6.109844], [63.5, 6.22256], [64, 6.333872], [64.5, 6.443698], [65, 6.55229], [65.5, 6.659823], 
              [66, 6.766481], [66.5, 6.872341], [67, 6.977398], [67.5, 7.081648], [68, 7.185], [68.5, 7.287805], [69, 7.390244], 
              [69.5, 7.492309], [70, 7.594181], [70.5, 7.695586], [71, 7.796163], [71.5, 7.895907], [72, 7.994741], [72.5, 8.092279], 
              [73, 8.188637], [73.5, 8.283627], [74, 8.377249], [74.5, 8.469968], [75, 8.561412], [75.5, 8.651671], [76, 8.740385], 
              [76.5, 8.827684], [77, 8.913462], [77.5, 8.997703], [78, 9.080901], [78.5, 9.16322], [79, 9.245227], [79.5, 9.327443],
              [80, 9.410618], [80.5, 9.495209], [81, 9.581465], [81.5, 9.669929], [82, 9.761267], [82.5, 9.855578], [83, 9.953286], 
              [83.5, 10.0544], [84, 10.15874], [84.5, 10.26604], [85, 10.37556], [85.5, 10.48714], [86, 10.60013], [86.5, 10.71376], 
              [87, 10.8278], [87.5, 10.94143], [88, 11.05443], [88.5, 11.16651], [89, 11.27754], [89.5, 11.38755], [90, 11.49627], 
              [90.5, 11.60418], [91, 11.71114], [91.5, 11.81775], [92, 11.92347], [92.5, 12.02877], [93, 12.13384], [93.5, 12.23869], 
              [94, 12.3435], [94.5, 12.44868], [95, 12.55442], [95.5, 12.66072], [96, 12.76787], [96.5, 12.87624], [97, 12.98583], 
              [97.5, 13.097], [98, 13.20979], [98.5, 13.32417], [99, 13.44033], [99.5, 13.55799], [100, 13.67733], [100.5, 13.79814], 
              [101, 13.92051], [101.5, 14.04427], [102, 14.16948], [102.5, 14.29624], [103, 14.42437], [103.5, 14.55376], [104, 14.6845], 
              [104.5, 14.8165], [105, 14.94985], [105.5, 15.08472], [106, 15.22084], [106.5, 15.35856], [107, 15.4978], [107.5, 15.63817], 
              [108, 15.78024], [108.5, 15.92381], [109, 16.06914], [109.5, 16.21622], [110, 16.36525] ]
            },
            {
              name: "5th",
              type: "area",
              data: [ [45, 2.106981], [45.5, 2.179956], [46, 2.252911], [46.5, 2.326226], [47, 2.400092], [47.5, 2.475063], [48, 2.551572], 
              [48.5, 2.630444], [49, 2.712292], [49.5, 2.79742], [50, 2.885574], [50.5, 2.976497], [51, 3.070327], [51.5, 3.167371], 
              [52, 3.268154], [52.5, 3.373464], [53, 3.483394], [53.5, 3.597603], [54, 3.715835], [54.5, 3.837139], [55, 3.960933], 
              [55.5, 4.086931], [56, 4.214808], [56.5, 4.343844], [57, 4.473289], [57.5, 4.602751], [58, 4.731982], [58.5, 4.860627], 
              [59, 4.988415], [59.5, 5.114823], [60, 5.239396], [60.5, 5.36134], [61, 5.480644], [61.5, 5.597732], [62, 5.71242], 
              [62.5, 5.825317], [63, 5.936584], [63.5, 6.046305], [64, 6.15465], [64.5, 6.261515], [65, 6.367164], [65.5, 6.471767], 
              [66, 6.57548], [66.5, 6.678396], [67, 6.78051], [67.5, 6.881819], [68, 6.982208], [68.5, 7.082064], [69, 7.181539], 
              [69.5, 7.2806], [70, 7.379471], [70.5, 7.477858], [71, 7.575438], [71.5, 7.672178], [72, 7.768056], [72.5, 7.862618], 
              [73, 7.956055], [73.5, 8.048159], [74, 8.138929], [74.5, 8.228845], [75, 8.317519], [75.5, 8.405039], [76, 8.491054], 
              [76.5, 8.575747], [77, 8.658991], [77.5, 8.740739], [78, 8.821532], [78.5, 8.9015], [79, 8.981224], [79.5, 9.061183], 
              [80, 9.142137], [80.5, 9.22453], [81, 9.308575], [81.5, 9.394803], [82, 9.483891], [82.5, 9.575937], [83, 9.671326], 
              [83.5, 9.770064], [84, 9.871983], [84.5, 9.976826], [85, 10.08383], [85.5, 10.19289], [86, 10.30333], [86.5, 10.41437], 
              [87, 10.52582], [87.5, 10.63682], [88, 10.74717], [88.5, 10.85661], [89, 10.96496], [89.5, 11.0723], [90, 11.17826], 
              [90.5, 11.28346], [91, 11.38761], [91.5, 11.49143], [92, 11.59427], [92.5, 11.69667], [93, 11.79879], [93.5, 11.90063], 
              [94, 12.00234], [94.5, 12.10437], [95, 12.2069], [95.5, 12.30989], [96, 12.41361], [96.5, 12.51852], [97, 12.62446], 
              [97.5, 12.73194], [98, 12.8409], [98.5, 12.95136], [99, 13.06348], [99.5, 13.17696], [100, 13.292], [100.5, 13.40842], 
              [101, 13.5263], [101.5, 13.64546], [102, 13.76597], [102.5, 13.88796], [103, 14.01121], [103.5, 14.13562], [104, 14.26132], 
              [104.5, 14.38817], [105, 14.51631], [105.5, 14.6459], [106, 14.77663], [106.5, 14.90889], [107, 15.0426], [107.5, 15.17728], 
              [108, 15.31363], [108.5, 15.45136], [109, 15.59077], [109.5, 15.7318], [110, 15.87468] ]
            },
            {
              name: "2nd",
              type: "area",
              data: [[45, 2.043085], [45.5, 2.114041], [46, 2.18499], [46.5, 2.25631], [47, 2.32817], [47.5, 2.401115], [48, 2.475566], 
              [48.5, 2.552331], [49, 2.631991], [49.5, 2.71485], [50, 2.80066], [50.5, 2.889173], [51, 2.980535], [51.5, 3.075034], 
              [52, 3.173182], [52.5, 3.275745], [53, 3.382814], [53.5, 3.494059], [54, 3.609233], [54.5, 3.727413], [55, 3.848024], 
              [55.5, 3.970797], [56, 4.095407], [56.5, 4.221164], [57, 4.347314], [57.5, 4.473502], [58, 4.599472], [58.5, 4.724876], 
              [59, 4.849452], [59.5, 4.972673], [60, 5.09411], [60.5, 5.212973], [61, 5.329248], [61.5, 5.44338], [62, 5.555138],
              [62.5, 5.665162], [63, 5.773573], [63.5, 5.88047], [64, 5.986016], [64.5, 6.090089], [65, 6.192965], [65.5, 6.294807], 
              [66, 6.395745], [66.5, 6.49589], [67, 6.595235], [67.5, 6.693776], [68, 6.791378], [68.5, 6.888461], [69, 6.985149], 
              [69.5, 7.081388], [70, 7.177438], [70.5, 7.272991], [71, 7.367757], [71.5, 7.461678], [72, 7.55478], [72.5, 7.646549], 
              [73, 7.737245], [73.5, 7.82664], [74, 7.914735], [74.5, 8.00202], [75, 8.088095], [75.5, 8.173043], [76, 8.256526], 
              [76.5, 8.338773], [77, 8.419636], [77.5, 8.499043], [78, 8.577574], [78.5, 8.65533], [79, 8.732905], [79.5, 8.810738], 
              [80, 8.889597], [80.5, 8.969915], [81, 9.051873], [81.5, 9.135985], [82, 9.222944], [82.5, 9.312846], [83, 9.406036], 
              [83.5, 9.502522], [84, 9.602142], [84.5, 9.704648], [85, 9.809266], [85.5, 9.915931], [86, 10.02395], [86.5, 10.13253], 
              [87, 10.24152], [87.5, 10.35002], [88, 10.45787], [88.5, 10.5648], [89, 10.67062], [89.5, 10.77542], [90, 10.87879], 
              [90.5, 10.98141], [91, 11.08292], [91.5, 11.1841], [92, 11.28423], [92.5, 11.38389], [93, 11.48324], [93.5, 11.58224], 
              [94, 11.68105], [94.5, 11.78012], [95, 11.87963], [95.5, 11.97952], [96, 12.08003], [96.5, 12.18169], [97, 12.28423], 
              [97.5, 12.38826], [98, 12.49363], [98.5, 12.60041], [99, 12.70876], [99.5, 12.81834], [100, 12.92938], [100.5, 13.04171], 
              [101, 13.1554], [101.5, 13.27026], [102, 13.38639], [102.5, 13.50393], [103, 13.62264], [103.5, 13.74241], [104, 13.86342], 
              [104.5, 13.98548], [105, 14.10877], [105.5, 14.23345], [106, 14.35916], [106.5, 14.48635], [107, 14.61492], [107.5, 14.74431], 
              [108, 14.87535], [108.5, 15.00765], [109, 15.14156], [109.5, 15.27697], [110, 15.41415]  ]
            },
            {
              name: "<2nd",
              type: "area",
              data: [ [45, 0.043085], [45.5, 0.114041], [46, 0.18499], [46.5, 0.25631], [47, 0.32817], [47.5, 0.401115], [48, 0.475566], 
              [48.5, 0.552331], [49, 0.631991], [49.5, 0.71485], [50, 0.80066], [50.5, 0.889173], [51, 0.980535], [51.5, 1.075034], 
              [52, 1.173182], [52.5, 1.275745], [53, 1.382814], [53.5, 1.494059], [54, 1.609233], [54.5, 1.727413], [55, 1.848024],
              [55.5, 1.970797], [56, 2.095407], [56.5, 2.221164], [57, 2.347314], [57.5, 2.473502], [58, 2.599472], [58.5, 2.724876],
               [59, 2.849452], [59.5, 2.972673], [60, 3.09411], [60.5, 3.212973], [61, 3.329248], [61.5, 3.44338], [62, 3.555138], 
               [62.5, 3.665162], [63, 3.773573], [63.5, 3.88047], [64, 3.986016], [64.5, 4.090089], [65, 4.192965], [65.5, 4.294807],
                [66, 4.395745], [66.5, 4.49589], [67, 4.595235], [67.5, 4.693776], [68, 4.791378], [68.5, 4.888461], [69, 4.985149], 
                [69.5, 5.081388], [70, 5.177438], [70.5, 5.272991], [71, 5.367757], [71.5, 5.461678], [72, 5.55478], [72.5, 5.646549],
                 [73, 5.737245], [73.5, 5.82664], [74, 5.914735], [74.5, 6.00202], [75, 6.088095], [75.5, 6.173043], [76, 6.256526],
                  [76.5, 6.338773], [77, 6.419636], [77.5, 6.499043], [78, 6.577574], [78.5, 6.65533], [79, 6.732905], [79.5, 6.810738],
                   [80, 6.889597], [80.5, 6.969915], [81, 7.051873], [81.5, 7.135985], [82, 7.222944], [82.5, 7.312846], [83, 7.406036],
                    [83.5, 7.502522], [84, 7.602142], [84.5, 7.704648], [85, 7.809266], [85.5, 7.915931], [86, 8.02395], [86.5, 8.13253],
                     [87, 8.24152], [87.5, 8.35002], [88, 8.45787], [88.5, 8.5648], [89, 8.67062], [89.5, 8.77542], [90, 8.87879], 
                     [90.5, 8.98141], [91, 9.08292], [91.5, 9.1841], [92, 9.28423], [92.5, 9.38389], [93, 9.48324], [93.5, 9.58224],
                      [94, 9.68105], [94.5, 9.78012], [95, 9.87963], [95.5, 9.97952], [96, 10.08003], [96.5, 10.18169], [97, 10.28423], 
                      [97.5, 10.38826], [98, 10.49363], [98.5, 10.60041], [99, 10.70876], [99.5, 10.81834], [100, 10.92938], [100.5, 11.04171], 
                      [101, 11.1554], [101.5, 11.27026], [102, 11.38639], [102.5, 11.50393], [103, 11.62264], [103.5, 11.74241], [104, 11.86342],
                       [104.5, 11.98548], [105, 12.10877], [105.5, 12.23345], [106, 12.35916], [106.5, 12.48635], [107, 12.61492], [107.5, 12.74431],
                        [108, 12.87535], [108.5, 13.00765], [109, 13.14156], [109.5, 13.27697], [110, 13.41415] ]
            }
    
          ],
          chart: {
            offsetX: 50,
            offsetY: 100,
            height: 700,
            width: 1000,
            type: "line"
          },
          grid: {
            show: false
          },
          stroke: {
            show: true,
            curve: "straight",
            colors: ["#000"],
            width: [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          },
          legend: {
            show: false,
            position: "right"
          },
          fill: {
            type: "solid",
            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            // white, red, yellow, yellow, green, green, green, green, green, yellow, yellow, red, white
            colors: ["#ffffff", "#cc0404", "#fae102", "#fae102", "#1da302", "#1da302", "#1da302", "#1da302", "#fae102", "#fae102", "#cc0404", "#ffffff"]
    
          },
          markers: {
            size: [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            colors: ['#000', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
            strokeColors: '#000',
            strokeWidth: 2,
            strokeOpacity: 0.5,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
              size: undefined,
              sizeOffset: 3
            }
          },
          yaxis: [
            {
              show: true,
              tickAmount: 10,
              labels: {
                show: true,
                align: 'right',
                minWidth: 0,
                maxWidth: 4,
                style: {
                  colors: [],
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-yaxis-label',
                },
                offsetX: 0,
                offsetY: 0,
                rotate: 0
              },
              title: {
                text: "Weight",
                rotate: -90,
                offsetX: 50,
                offsetY: 50,
                style: {
                  color: "000",
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-yaxis-title',
                }
                // forceNiceScale: true
              }
            }
          ],
          xaxis: {
            labels: {
              show: true,
              style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
              },
              offsetX: 0,
              offsetY: 0,
              rotate: 0
            },
            title: {
              text: "Length",
              offsetX: 0,
              offsetY: 0,
              style: {
                color: "000",
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-title',
              }
            },
            type: 'numeric',
            tickAmount: 10,
          },
          tooltip: {
            shared: true,
            intersect: false,
            x: {
              formatter: function (x) {
                if (typeof x !== "undefined") {
                  return x.toFixed(0) + " cm";
                }
                return x;
              }
            },
            y: {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(0) + " kg";
                }
                return y;
              }
            }
          }
        };
        break;
    }
   }
   

    
  }


  /*
    When the parent select the child to work on his data it is necessary to have into account different cases:
    There is not data available for any child. There is  data from others children but there is not data to the
    child in question or there is data available from the child. 
  */
  onChildrenChange() {
    // there is not data at all
    if (this.childrenList.length === 0) {
      if (this.currentParent.children === null) {
        this.currentParent.children = [] as FFQChildren[];
      }

      // creates children from the names available from the parent property childrennames
      if (this.currentParent.children.length === 0) {
        for (let name of this.currentParent.childrennames) {
          this.childrenList.push(new FFQChildren(name, [] as FFQChildData[]));
        }
      } else {
        // there is data from the child to retrive
        // creates children from the names available from the parent property childrennames
        for (let name of this.currentParent.childrennames) {
          this.childrenList.push(new FFQChildren(name, [] as FFQChildData[]));
        }
        // there is data from the child to retrievied
        for (let child of this.currentParent.children) {
          let index = this.childrenList.findIndex((x) => x.name === child.name);
          if (index > -1) {
            for (let data of child.childData)
              this.childrenList[index].addData(data);
          }
        }
      }
      let index = this.childrenList.findIndex(
        (x) => x.name === this.currentChildName
      );
      if (index > -1) {
        this.currentChild = this.childrenList[index];
      }
    }
    this.onTypeChartChange(this.chosenChartOption);
  }

  // the event is triggered when the type of chart is changed
  onTypeChartChange(typeOfChart: string) {
    switch (typeOfChart) {
      case ChartOption.BMI: {
        this.getMBIChart(this.currentChildGender);
        this.yaxis.title.text = this.translate.instant(
          `${this.currentChildGender} BMI - Metric System`
        );
        this.xaxis.title.text = this.translate.instant("Age (month)");
        break;
      }
      case ChartOption.HeightAge: {
        this.getHeightAgeChart(this.currentChildGender);
        this.xaxis.title.text = this.translate.instant("Age (month)");
        this.yaxis.title.text =
          this.translate.instant(`${this.currentChildGender} Height`) +
          ` (${this.heightUnitOptions})`;
        break;
      }
      case ChartOption.WeightAge: {
        this.getWeightAgeChart(this.currentChildGender);
        this.xaxis.title.text = this.translate.instant("Age (month)");
        this.yaxis.title.text =
          this.translate.instant(`${this.currentChildGender} Weight`) +
          ` (${this.weightUnitOptions})`;
        break;
      }
      case ChartOption.WeightHeight: {
        this.getWeightHeightChart(this.currentChildGender);
        this.xaxis.title.text =
          this.translate.instant(`${this.currentChildGender} Height`) +
          ` (${this.heightUnitOptions})`;
        this.yaxis.title.text =
          this.translate.instant(`${this.currentChildGender} Weight`) +
          ` (${this.weightUnitOptions})`;
        break;
      }
    }
    //this.plottingData();
    this.plottingDataNew();
  }

  onLangChange() {
    this.lang = !this.lang;
    if (this.translate.currentLang === "es") {
      this.translate.use("en-US");
    } else {
      this.translate.use("es");
    }
  }
  onHelp() {
    let data = { data: { langauge: this.translate.currentLang } };

    const dialogRef = this.dialog.open(GrowthChartsHelpComponent, data);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /*
  {
    "name": "0",
    "value": "52",
    "series": "Tom"
  }
*/
  onSelect(selectedData: any): void {
    if (this.currentChild.name === selectedData.series) {
      //console.log("Item clicked", JSON.parse(JSON.stringify(selectedData)));

      let data;

      if (this.chosenChartOption === ChartOption.WeightAge) {
        data = {
          data: {
            title: "Weight Chart's Interpretation",
            value: selectedData.value,
            name: selectedData.series,
            messages: [
              "This calculator provides your child's weight percentile based on age. The percentile shows how your child's weight compares to other children. The percentile tells you what percentage of children weigh less than your child. For example out of a sample of 100 children, a percentile value of 40 percent means your child weighs more than 40 children and weighs less than the other 60.",
              "A percentile of 50% represents the average or mean weight. A value below 50 percent means a child weighs less than the average. A value greater than 50 percent means a child is above average. This does not mean your child is overweight or underweight. A doctor or physician should be consulted to determine weight status.",
            ],
          },
        };
      } else if (this.chosenChartOption === ChartOption.HeightAge) {
        data = {
          data: {
            title: "Height Chart's Interpretation",
            value: selectedData.value,
            name: selectedData.series,
            messages: [
              "This calculator provides your child's stature percentile based on age. Stature is the standing upright height of the child. The percentile shows how your child's height or stature compares to other children. The percentile tells you what percentage of children that have a height less than your child. For example out of a sample of 100 children, a percentile value of 45 percent means your child measures more than 45 children and measures less than the other 55 children.",
              "A percentile of 50% represents the average or mean height or stature. A value below 50 percent means a child measures less than the average or is shorter than average. A value greater than 50 percent means a child is above average or taller than average. This does not mean your child is short or tall. A doctor or physician should be consulted to determine height status.",
            ],
          },
        };
      } else if (this.chosenChartOption === ChartOption.WeightHeight) {
        data = {
          data: {
            title: "Weight - Height Chart's Interpretation",
            value: selectedData.value,
            name: selectedData.series,
            messages: [
              "This calculator provides your child's weight percentile based on stature. Stature is upright height or standing straight height. The percentile shows how your child's weight compares to other children of the same height. The percentile tells you what percentage of children weigh less than your child. For example out of a sample of 100 children, a percentile value of 40 percent means your child weighs more than 40 children and weighs less than the other 60 children.",
              "A percentile of 50% represents the average or mean weight. A value below 50 percent means a child weighs less than the average. A value greater than 50 percent means a child is above average. This does not mean your child is overweight or underweight. A doctor or physician should be consulted to determine weight status.",
            ],
          },
        };
      } else if (this.chosenChartOption === ChartOption.BMI) {
        data = {
          data: {
            title: "BMI Chart's Interpretation",
            value: selectedData.value,
            name: selectedData.series,
            message: [
              "This calculator provides body mass index (BMI) and the corresponding BMI-for-age percentile based on WHO growth charts for children ages 0 through 24 months. This calculator can help to determine whether a child is at a healthy weight for his/her height, age and gender. The amounts of body fat, muscle, and bone change with age, and differ between boys and girls. This BMI-calculator automatically adjusts for differences in height, age and gender, making it is one of the best tools for evaluating a growing child's weight. ",
              "Plotting a child's BMI-for-age on the appropriate WHO growth chart can alert parents to early signs that their child is gaining weight too fast, enabling them to help their child avoid developing weight problems by making small changes in their family's diet and physical activity habits. Keep in mind that BMI is not a diagnostic tool. BMI and BMI-percentile-for-age do not directly measure body fat. Very athletic kids can have a high BMI-for-age due to extra muscle mass, not necessarily excess body fat. As a result, a child may have a high BMI for their age and gender, but to determine if excess fat is a problem, a health care provider would need to perform further tests.",
            ],
          },
        };
      }

      const dialogRef = this.dialog.open(
        InterpretationGrowthChartsDialogComponent,
        data
      );

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  async creatingPdf() {
    // Charts are now rendered
    const chart = document.getElementById("chart-line");
    html2canvas(chart, {
      height: chart.scrollHeight,
      width: chart.clientWidth,
      scale: 3,
      backgroundColor: null,
      logging: false,
    }).then((canvas) => {
      // Get chart data so we can append to the pdf
      const chartData = canvas.toDataURL();

      // Prepare pdf structure
      const docDefinition = {
        content: [],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: "black",
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "left",
          },
          subsubheader: {
            fontSize: 12,
            italics: true,
            margin: [0, 10, 0, 25],
            alignment: "left",
          },
          table: {
            margin: [0, 5, 0, 15],
          },
        },
        defaultStyle: {
          // alignment: 'justify'
        },
        pageOrientation: "portrait",
      };

      // Add some content to the pdf
      const title = {
        text: `${this.currentChild.name}'s Data:`,
        style: "subheader",
      };

      let counter = 0;
      let graphData: string[] = [] as string[];
      graphData.push(`x: ${this.xaxis.title.text}, y: ${this.yaxis.labels}\n`);
      for (let pointData of this.currentChild.childData) {
        switch (this.chosenChartOption) {
          case ChartOption.BMI:
            if (counter < 3) {
              graphData.push(
                `(x: ${pointData.age}, y: ${(
                  parseFloat(pointData.weight) /
                  Math.pow(
                    parseFloat(pointData.height) / FFQChildren.M_TO_CM,
                    2
                  )
                )}) `
              );
              counter++;
            } else {
              graphData.push(
                `(x: ${pointData.age}, y: ${(
                  parseFloat(pointData.weight) /
                  Math.pow(
                    parseFloat(pointData.height) / FFQChildren.M_TO_CM,
                    2
                  )
                )}) \n`
              );
              counter = 0;
            }

            break;
          case ChartOption.HeightAge:
            if (counter < 3) {
              graphData.push(`(x: ${pointData.age}, y: ${pointData.height}) `);
              counter++;
            } else {
              graphData.push(
                `(x: ${pointData.age}, y: ${pointData.height}) \n`
              );
              counter = 0;
            }
            break;
          case ChartOption.WeightAge:
            if (counter < 3) {
              graphData.push(`(x: ${pointData.age}, y: ${pointData.weight}) `);
              counter++;
            } else {
              graphData.push(
                `(x: ${pointData.age}, y: ${pointData.weight}) \n`
              );
              counter = 0;
            }
            break;
          case ChartOption.WeightHeight:
            if (counter < 3) {
              graphData.push(
                `(x: ${pointData.height}, y: ${pointData.weight}) `
              );
              counter++;
            } else {
              graphData.push(
                `(x: ${pointData.height}, y: ${pointData.weight}) \n`
              );
              counter = 0;
            }
            break;
        }
      }
      const description = {
        text: graphData.join(""),
        style: "subsubheader",
      };
      docDefinition.content.push(title);
      docDefinition.content.push(description);
      // Push image of the chart
      docDefinition.content.push({
        image: chartData,
        width: 450,
      });
      this.myDocDefinition = docDefinition;

      if (this.myDocDefinition) {
        let pdf = pdfMake.createPdf(this.myDocDefinition);
        this.loading = false;

        pdf.download(this.chosenChartOption + ".pdf");
      } else {
        console.log("Chart is not yet rendered!");
      }
    });
  }

  async onDownloadSave() {
    this.loading = true;
    await this.creatingPdf();
  }

  onActivate(): void {
    //console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(): void {
    //console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    const parent: Observable<FFQParentResponse> = this.parentService.getParent(
      this.authenticationService.currentUserId
    );
    parent.subscribe((parent) => {
      this.currentParent = parent;
    });
  }

  /* 
    Due the fact that we don't have a bmi data from the who webside for the us customary system,
    an approach to solve the issue is to convert the units of measurements from lb to kg and from
     in to meters to calculate the bmi data provided by the parent
   */
  getMBIChart(childGender: string) {
    if (childGender === Gender.Male) {
      this.currentGrowthChartData =
        GrowthChartData.BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
    } else if (childGender === Gender.Female) {
      this.currentGrowthChartData =
        GrowthChartData.GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
    }
  }
  /* 
    Gets the correct data for MBI charts depending on gender
  */
  getHeightAgeChart(childGender: Gender) {
    switch (this.heightUnitOptions) {
      case UnitsOfMeasurement.cm:
        if (childGender === Gender.Male) {
          this.currentGrowthChartData =
            GrowthChartData.BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        } else if (childGender === Gender.Female) {
          this.currentGrowthChartData =
            GrowthChartData.GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        }
        break;
      case UnitsOfMeasurement.in:
        if (childGender === Gender.Male) {
          this.currentGrowthChartData =
            GrowthChartData.BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        } else if (childGender === Gender.Female) {
          this.currentGrowthChartData =
            GrowthChartData.GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        }
        break;
    }
  }

  /* 
    Gets the correct data for MBI charts depending on gender
  */
  getWeightAgeChart(childGender: Gender) {
    switch (this.weightUnitOptions) {
      case UnitsOfMeasurement.kg:
        if (childGender === Gender.Male) {
          this.currentGrowthChartData =
            GrowthChartData.BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        } else if (childGender === Gender.Female) {
          this.currentGrowthChartData =
            GrowthChartData.GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        }
        break;
      case UnitsOfMeasurement.lb:
        if (childGender === Gender.Male) {
          this.currentGrowthChartData =
            GrowthChartData.BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        } else if (childGender === Gender.Female) {
          this.currentGrowthChartData =
            GrowthChartData.GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        }
        break;
    }
  }

  /* 
  Gets the correct data for Weight_vs_Height charts depending on gender and units of measurements. 
  The data for WEIGHT_FOR_LENGTH_BIRTH_TO_TWO_YEARS for male and female has to many points to plot.
  So, to obtain more pleasant visual effects will be trimmed to a maximum 24 points (MAX_RANGE_MONTHS) when
  there is no point or at least one where the avg of the values of the child will be the media of the graph
   */
  getWeightHeightChart(childGender: Gender) {
    switch (this.weightUnitOptions) {
      case UnitsOfMeasurement.kg:
        if (this.heightUnitOptions === UnitsOfMeasurement.cm) {
          if (childGender === Gender.Male) {
            this.currentGrowthChartData =
              GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
          } else if (childGender === Gender.Female) {
            this.currentGrowthChartData =
              GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
          }
        } else if (this.heightUnitOptions === UnitsOfMeasurement.in) {
          if (childGender === Gender.Male) {
            this.currentGrowthChartData =
              GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN;
          } else if (childGender === Gender.Female) {
            this.currentGrowthChartData =
              GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN;
          }
        }
        break;
      case UnitsOfMeasurement.lb:
        if (this.heightUnitOptions === UnitsOfMeasurement.cm) {
          if (childGender === Gender.Male) {
            this.currentGrowthChartData =
              GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM;
          } else if (childGender === Gender.Female) {
            this.currentGrowthChartData =
              GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM;
          }
        } else if (this.heightUnitOptions === UnitsOfMeasurement.in) {
          if (childGender === Gender.Male) {
            this.currentGrowthChartData =
              GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
          } else if (childGender === Gender.Female) {
            this.currentGrowthChartData =
              GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
          }
        }
        break;
    }
  }

  /* 
    Finds an optimal interval where pointX is centered and the range is total number of point in the interval
  */
  trimChartData(pointX: string, range: number, chartData: any[]) {
    let index = this.getIndex(
      pointX,
      chartData[0].series,
      0,
      chartData[0].series.length - 1
    );

    let suitableIndexLeft = index - range;
    let suitableIndexRight = index + range;

    while (suitableIndexLeft < 0) {
      suitableIndexLeft++;
    }

    while (suitableIndexRight >= chartData[0].series.length) {
      suitableIndexRight--;
    }

    let left = suitableIndexLeft;
    let min = Number.MAX_VALUE;

    do {
      if (
        Math.abs(index - suitableIndexLeft - (suitableIndexRight - index)) < min
      ) {
        left = suitableIndexLeft;
        suitableIndexRight = index + range - (index - left);
        min = Math.abs(
          index - suitableIndexLeft - (suitableIndexRight - index)
        );
      }
      suitableIndexLeft++;
    } while (
      suitableIndexLeft < index &&
      suitableIndexLeft + range - 1 < chartData[0].series.length
    );

    let startIndex = left;
    let ChartDataInRange: any[] = [];

    for (let percentile of chartData) {
      let chartDataSeries: any[] = [];
      for (let j = startIndex; j < startIndex + range; j++) {
        chartDataSeries.push(percentile.series[j]);
      }
      ChartDataInRange.push({ name: percentile.name, series: chartDataSeries });
    }
    return ChartDataInRange;
  }

  getIndex(
    pointX: string,
    dataChart: any[],
    startIndex: number,
    endIndex: number
  ) {
    if (endIndex >= startIndex) {
      let middleIndex = Math.floor((startIndex + endIndex) / 2);
      if (
        parseFloat(dataChart[middleIndex].name) === parseFloat(pointX) ||
        endIndex == startIndex
      )
        return middleIndex;

      if (parseFloat(dataChart[middleIndex].name) > parseFloat(pointX))
        return this.getIndex(pointX, dataChart, startIndex, middleIndex - 1);

      return this.getIndex(pointX, dataChart, middleIndex + 1, endIndex);
    }
    if (parseFloat(pointX) < parseFloat(dataChart[0].name)) return 0;
    if (parseFloat(pointX) > parseFloat(dataChart[dataChart.length - 1].name))
      return dataChart.length - 1;
  }
}
