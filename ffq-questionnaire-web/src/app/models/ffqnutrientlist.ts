import {FFQItemInput} from './ffqitem-input';
import {FFQItemResponse, FoodType} from './ffqitem-response';
import {Serving} from './ffqitem-response';
import { FFQFoodNutrientsResponse } from './ffqfoodnutrients-response';

export class FFQNutrientlist {
  id: string;
  nutrientListID: string;
  nutrientMap: any;

  constructor(id: string, nutrientMap: any) {
    this.nutrientListID = id;
    this.nutrientMap = nutrientMap;
  }
}

export class nutrientMap {

  // only includes the 19 main nutrients used for recomendations
  "Retinol (mcg)" : number;
  "Vitamin D (mcg)" : number;
  "Vitamin E (mg)" : number;
  "Vitamin K (mcg)" : number;
  "Vitamin C (Ascorbic acid) (mg)" : number;
  "Vitamin B1 (Thiamin) (mg)" : number;
  "Vitamin B2 (Riboflavin) (mg)" : number;
  "Vitamin B3 (Niacin) (mg)" : number;
  "Vitamin B5 (Pantothenic acid) (mg)" : number;
  "Vitamin B6 (mg)" : number;
  "Vitamin B9 (Folate) (mcg)" : number;
  "Vitamin B12 (Cobalamin) (mcg)" : number;
  "Calcium (mg)" : number;
  "Phosphorus (mg)" : number;
  "Magnesium (mg)" : number;
  "Iron (mg)" : number;
  "Zinc (mg)" : number;
  "Copper (mg)" : number;
  "Potassium (mg)" : number;

  constructor(typeName: string, nutrientListID: string){
    this["Retinol (mcg)"] = 0;
    this["Vitamin D (mcg)"] = 0;
    this["Vitamin E (mg)"] = 0;
    this["Vitamin K (mcg)"] = 0;
    this["Vitamin C (Ascorbic acid) (mg)"] = 0;
    this["Vitamin B1 (Thiamin) (mg)"] = 0;
    this["Vitamin B2 (Riboflavin) (mg)"] = 0;
    this["Vitamin B3 (Niacin) (mg)"] = 0;
    this["Vitamin B5 (Pantothenic acid) (mg)"] = 0;
    this["Vitamin B6 (mg)"] = 0;
    this["Vitamin B9 (Folate) (mcg)"] = 0;
    this["Vitamin B12 (Cobalamin) (mcg)"] = 0;
    this["Calcium (mg)"] = 0;
    this["Phosphorus (mg)"] = 0;
    this["Magnesium (mg)"] = 0;
    this["Iron (mg)"] = 0;
    this["Zinc (mg)"] = 0;
    this["Copper (mg)"] = 0;
    this["Potassium (mg)"] = 0;
  }
}

