import {FFQItemInput} from './ffqitem-input';
import {FFQItemResponse} from './ffqitem-response';
import {Serving} from './ffqitem-response';
import { FFQSugar } from './ffqsugar';
import { ObjectUnsubscribedError } from 'rxjs';

export class FFQFoodItemResponse {
  id: string;
  name: string;
  servingsList: string[];
  sugar: FFQSugar;
  primary: boolean;
  foodTypes: FoodType[];
  nutrientId: string;
  portionSize: string;
  itemPosition: number;

  constructor(name: string, id: string, itemPosition: number) {
    this.name = name;
    this.id = id;
    this.servingsList = null;
    this.sugar = null;
    this.primary = null;
    this.foodTypes = [];
    this.nutrientId = "";
    this.portionSize = "";
    this.itemPosition = itemPosition;


    const foodtype = new FoodType("","");

    this.foodTypes.push(foodtype);
  }
}

export class FoodType {
  typeName: string;
  nutrientListID: string;

  constructor(typeName: string, nutrientListID: string){
    this.typeName = "";
    this.nutrientListID = "";
  }
}

