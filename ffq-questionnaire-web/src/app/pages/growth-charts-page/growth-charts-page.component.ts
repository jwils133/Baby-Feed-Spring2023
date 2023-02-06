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

import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-growth-charts-page",
  templateUrl: "./growth-charts-page.component.html",
  styleUrls: ["./growth-charts-page.component.css"],
})
export class GrowthChartsPageComponent implements OnInit {
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

  /* 
  charts options
  example: https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical
  documentation: https://swimlane.gitbook.io/ngx-charts/
  */

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "";
  yAxisLabel: string = "";
  timeline: boolean = true;
  view: any[] = [1400, 1400];
  results: any[] = [];
  position: string = "right";

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

      this.plottingData();
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
  plottingData() {
    let newResult = [];

    /* depending on the type of charts we will choose the correct chart taking into 
    account unit of measurements and gender */
    switch (this.currentGrowthChartData) {
      case GrowthChartData.BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          /* 
          the data needs to be copy using a deep copy method to avoid a reference
          modification of the data by mistake 
          */
          newResult = DataManipulation.getDeepCopy(
            BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(this.currentChild.getBMIChartData());
        } else newResult = BOYS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(
            this.currentChild.getHeightChartData(this.heightUnitOptions)
          );
        } else newResult = BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getHeightChartData(this.heightUnitOptions)
          );
        } else
          newResult =
            BOYS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );

          newResult.push(
            this.currentChild.getWeightChartData(this.weightUnitOptions)
          );
        } else newResult = BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightChartData(this.weightUnitOptions)
          );
        } else
          newResult =
            BOYS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult = BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM;
        break;
      case GrowthChartData.BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            BOYS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(this.currentChild.getBMIChartData());
        } else newResult = GIRLS_BMI_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(
            this.currentChild.getHeightChartData(this.heightUnitOptions)
          );
        } else
          newResult = GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getHeightChartData(this.heightUnitOptions)
          );
        } else
          newResult =
            GIRLS_HEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightChartData(this.weightUnitOptions)
          );
        } else
          newResult = GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;

      case GrowthChartData.GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightChartData(this.weightUnitOptions)
          );
        } else
          newResult =
            GIRLS_WEIGHT_FOR_AGE_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult = GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_METRIC_SYSTEM;
        break;
      case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
      case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_KG_VS_IN;
        break;
      case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_MIXED_SYSTEM_LB_VS_CM;
        break;
      case GrowthChartData.GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM:
        if (this.currentChild.childData.length !== 0) {
          newResult = DataManipulation.getDeepCopy(
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM
          );
          newResult.push(
            this.currentChild.getWeightHeightChartData(
              this.heightUnitOptions,
              this.weightUnitOptions
            )
          );
        } else
          newResult =
            GIRLS_WEIGHT_FOR_HEIGHT_BIRTH_TO_TWO_YEARS_US_CUSTOMARY_SYSTEM;
        break;
    }

    this.results = newResult;
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
        this.yAxisLabel = this.translate.instant(
          `${this.currentChildGender} BMI - Metric System`
        );
        this.xAxisLabel = this.translate.instant("Age (month)");
        break;
      }
      case ChartOption.HeightAge: {
        this.getHeightAgeChart(this.currentChildGender);
        this.xAxisLabel = this.translate.instant("Age (month)");
        this.yAxisLabel =
          this.translate.instant(`${this.currentChildGender} Height`) +
          ` (${this.heightUnitOptions})`;
        break;
      }
      case ChartOption.WeightAge: {
        this.getWeightAgeChart(this.currentChildGender);
        this.xAxisLabel = this.translate.instant("Age (month)");
        this.yAxisLabel =
          this.translate.instant(`${this.currentChildGender} Weight`) +
          ` (${this.weightUnitOptions})`;
        break;
      }
      case ChartOption.WeightHeight: {
        this.getWeightHeightChart(this.currentChildGender);
        this.xAxisLabel =
          this.translate.instant(`${this.currentChildGender} Height`) +
          ` (${this.heightUnitOptions})`;
        this.yAxisLabel =
          this.translate.instant(`${this.currentChildGender} Weight`) +
          ` (${this.weightUnitOptions})`;
        break;
      }
    }
    this.plottingData();
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
      graphData.push(`x: ${this.xAxisLabel}, y: ${this.yAxisLabel}\n`);
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
