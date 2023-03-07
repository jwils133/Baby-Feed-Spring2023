import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ThemePalette } from "@angular/material/core";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
import html2canvas from "html2canvas";

import { ParentService } from "src/app/services/parent/parent-service";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { FFQParentResponse } from "src/app/models/ffqparent-response";

import { FFQChildren } from "src/app/models/ffqchildren";
import { FFQChildData } from "src/app/models/ffq-childData";

import {
  UnitsOfMeasurement,
  Gender,
  ChartOption,
  GrowthChartData,
} from "src/app/models/Enums";

@Component({
  selector: 'app-child-details-table',
  templateUrl: './child-details-table.component.html',
  styleUrls: ['./child-details-table.component.css']
})
export class ChildDetailsTableComponent implements OnInit {
  
  people: {date: string; name: string; length: string; weight: string; age: number; }[];

  constructor() { }

  ngOnInit(): void {
    this.people = [
      {date:'January 10th, 2022', name: 'John', length: '65.9', weight: '7.4', age: 5 },
      {date:'June 10th, 2022', name: 'John', length: '73.3', weight: '9.7', age: 10 },
      {date:'November 10th, 2022', name: 'John', length: '75', weight: '11', age: 15 },
      {date:'April 10th, 2024', name: 'John', length: '80', weight: '14kg', age: 20 },
    ];
  }

}
