import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import {FFQResultsResponse} from 'src/app/models/ffqresultsresponse';
import {FoodRecommendationsService} from 'src/app/services/food-recommendation-service/food-recommendations.service';
import {FFQFoodRecommendations} from 'src/app/models/ffqfood-recommendations';
import {createHostListener} from '@angular/compiler/src/core';
import {FFQParent} from "../../models/ffqparent";
import {TrackerResultsResponse} from 'src/app/models/trackerresultsresponse';

@Injectable({
  providedIn: 'root'
})

export class ExportService {

  constructor(
    public foodRecommendationsService: FoodRecommendationsService
  ) {
  }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';

  public exportTrackingHistory(results: TrackerResultsResponse[], parentList: string[], fileName: string): void {
    const trackingHistory: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getTrackingJSON(results, parentList));
    const wb: XLSX.WorkBook = {Sheets: {TrackingHistory: trackingHistory}, SheetNames: ['TrackingHistory']};
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    this.saveExcelFile(excelBuffer, fileName);
  }

  private getTrackingJSON(results: TrackerResultsResponse[], parentList: string[]): any {

    var resultRows = [];

    results.forEach(result => {

      var resultCol = {
        'Participant Username': parentList[result.userId],
        'Date': result.date,
        'Age(Months)': result.age
      };

      for (let item of result.responses) {
        resultCol[item['food']] = item['response'];
      }

      resultRows.push(resultCol)

    });

    return resultRows;
  }

  // had to make a new function because the input lists for both lists are in different formats; can't index with userID in clinic
  public exportClinicTrackingHistory(results: TrackerResultsResponse[], parentList: string[], fileName: string): void {
    const trackingHistory: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getClinicTrackingJSON(results, parentList));
    const wb: XLSX.WorkBook = {Sheets: {TrackingHistory: trackingHistory}, SheetNames: ['TrackingHistory']};
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    this.saveExcelFile(excelBuffer, fileName);
  }

  private getClinicTrackingJSON(results: TrackerResultsResponse[], parentList: string[]): any {

    let resultRows = [];
    let parentIndex = 0;

    results.forEach(result => {

      const resultCol = {
        'Participant Username': parentList[parentIndex++],
        Date: result.date,
        'Age(Months)': result.age,
        Goal: result.goal
      };

      for (const item of result.responses) {
        resultCol[item.food] = item.response;
      }

      resultRows.push(resultCol);


    });

    return resultRows;
  }

  public exportFFQResults(results: FFQResultsResponse[], parentList: FFQParent[], fileName: string): void {

    const nutrients: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getNutrientJson(results, parentList));
    const foodGroups: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getFoodGroupsJson(results, parentList));
    const foods: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getFoodsJson(results, parentList));
    const wb: XLSX.WorkBook = {
      Sheets: {Nutrients: nutrients, FoodGroups: foodGroups, Foods: foods},
      SheetNames: ['Nutrients', 'FoodGroups', 'Foods']
    };
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    this.saveExcelFile(excelBuffer, fileName);
  }

  // Creates json object with nutrient sheet rows and collumns of data
  private getNutrientJson(results: FFQResultsResponse[], parentList: FFQParent[]): any {

    // Array of rows of data
    const resultRows = [];
    const parentListData = parentList;
    results.forEach(result => {
      // Initialize columns with general result information
      const resultCol = {
        'Participant Username': parentList.find(parent => parent.userId === result.userId)?.username ?? '[not found]',
        'Questionnaire ID': result.questionnaireId,
        Date: result.date,
        Name: result.patientName,
        Age: result.ageInMonths,
        Gender: result.gender,
        ReadRecommend: parentList.find(parent => parent.userId === result.userId)?.lastReadRecommend,
        TimesOfReading: parentList.find(parent => parent.userId === result.userId)?.timesOfReading,
      };

      // Add columns with nurient data
      for (const key of result.dailyAverages.keys()) {
        // Protection against undefined daily averages
        resultCol[key] = result.dailyAverages.get(key);
        if (typeof resultCol[key] === 'number') {
          resultCol[key] = resultCol[key].toFixed(2);
        } else {
          resultCol[key] = 0.0;
        }
      }

      // Push columns to array of rows
      resultRows.push(resultCol);

    });

    return resultRows;

  }

  private getFoodsJson(results: FFQResultsResponse[], parentList: FFQParent[]): any {

    // Array of rows of data
    var resultRows = [];

    results.forEach(result => {

      // Initialize columns with general result information
      var resultCol = {
        'Participant Username': parentList.find(parent => parent.userId === result.userId)?.username ?? "[not found]",
        'Questionnaire ID': result.questionnaireId,
        Date: result.date,
        Name: result.patientName,
        Age: result.ageInMonths
      };

      // Add columns with nurient data
      result.userChoices.forEach(choice => {

        resultCol[choice.name + ' frequency'] = choice.frequency;
        resultCol[choice.name + ' frequency type'] = choice.frequencyType;
        resultCol[choice.name + ' servings'] = choice.serving;

      });


      // Push columns to array of rows
      resultRows.push(resultCol);

    });

    return resultRows;

  }

  private getFoodGroupsJson(results: FFQResultsResponse[], parentList: FFQParent[]): any {

    // Array of rows of data
    var resultRows = [];

    results.forEach(result => {

      // Initialize columns with general result information
      var resultCol = {
        'Participant Username': parentList.find(parent => parent.userId === result.userId)?.username ?? "[not found]",
        'Questionnaire ID': result.questionnaireId,
        Date: result.date,
        Name: result.patientName,
        Age: result.ageInMonths
      };

      // Add columns with nurient data
      result.foodRecList.forEach(res => {
        res.foodCategoryRecList.forEach(food => {
          resultCol[food.categoryName] = food.calculatedAmount.toFixed(2);
        });
      });

      // Push columns to array of rows
      resultRows.push(resultCol);

    });

    return resultRows;
  }


  public exportExcel(jsonData: any[], fileName: string): void {

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = {Sheets: {data: ws}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }
}
