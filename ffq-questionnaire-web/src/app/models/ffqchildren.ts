//Classed to store admin user data in components

import { FFQChildData } from "./ffq-childData";
import { UnitsOfMeasurement } from "./Enums";

export class FFQChildren {
  name: string;
  //weightLengthDataByMonth
  childData: FFQChildData[];

  constructor(name: string, childData: FFQChildData[]) {
    this.name = name;
    this.childData = childData;
  }

  public static readonly KG_TO_LB: number = 2.204623;
  public static readonly IN_TO_CM: number = 2.54;
  public static readonly M_TO_CM: number = 100;

  addData(data: FFQChildData): void {
    let filteredData = this.childData.find((x) => x.age === data.age);

    if (filteredData === undefined) {
      this.childData.push(data);
      this.childData.sort(function (a, b) {
        if (a.age === b.age) return 0;
        return parseInt(a.age) < parseInt(b.age) ? -1 : 1;
      });
    } else {
      filteredData.height = data.height;
      filteredData.weight = data.weight;
    }
  }

  getHeightChartData(unitType: UnitsOfMeasurement): any {
    console.log("inside method");
    let heightbyMonth: { name: string; value: string }[] = [];

    let divider: number = 1;
    if (unitType === UnitsOfMeasurement.in) divider = FFQChildren.IN_TO_CM;

    for (let data of this.childData) {
      heightbyMonth.push({
        name: data.age,
        value: Math.round(parseFloat(data.height) / divider).toString(),
      });
    }
    return { name: this.name, series: heightbyMonth };
  }

  getWeightChartData(unitType: UnitsOfMeasurement): any {
    let multiplier: number = 1;
    if (unitType === UnitsOfMeasurement.lb) multiplier = FFQChildren.KG_TO_LB;
    let weightbyMonth: { name: string; value: string }[] = [];
    for (let data of this.childData) {
      weightbyMonth.push({
        name: data.age,
        value: Math.round(parseFloat(data.weight) * multiplier).toString(),
      });
    }
    return { name: this.name, series: weightbyMonth };
  }

  getWeightHeightChartData(
    heightMeasurementUnit: UnitsOfMeasurement,
    weightMeasurementUnit: UnitsOfMeasurement
  ): any {
    let multiplier: number = 1;
    if (weightMeasurementUnit === UnitsOfMeasurement.lb)
      multiplier = FFQChildren.KG_TO_LB;

    let divider: number = 1;
    if (heightMeasurementUnit === UnitsOfMeasurement.in)
      divider = FFQChildren.IN_TO_CM;

    let weightbyHeight: { name: string; value: string }[] = [];
    for (let data of this.childData) {
      weightbyHeight.push({
        name: Math.round(parseFloat(data.height) / divider).toString(),
        value: Math.round(parseFloat(data.weight) * multiplier).toString(),
      });
    }

    return { name: this.name, series: weightbyHeight };
  }

  getBMIChartData(): any {
    let bmiByMonth: { name: string; value: string }[] = [];
    for (let data of this.childData) {
      bmiByMonth.push({
        name: data.age,
        value: (
          parseFloat(data.weight) /
          Math.pow(parseFloat(data.height) / FFQChildren.M_TO_CM, 2)
        )
          .toFixed(1)
          .toString(),
      });
    }
    return { name: this.name, series: bmiByMonth };
  }
}
