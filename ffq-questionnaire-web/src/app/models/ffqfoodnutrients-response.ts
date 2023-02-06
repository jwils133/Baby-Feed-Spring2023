import { FFQFoodItem } from './ffqfooditem';
import { FFQNutrientlist } from './ffqnutrientlist';
import { FFQItemInput } from './ffqitem-input';
import { FoodType } from './ffqitem-response';
import { FFQFoodItemResponse } from './ffqfooditem-response';

export class FFQFoodNutrientsResponse {
    foodItem: FFQFoodItemResponse;
    nutrientList: Array<FFQNutrientlist>;

    constructor(fooditem: FFQFoodItemResponse, nutrientlist: Array<FFQNutrientlist>) {
      this.foodItem = fooditem;
      this.nutrientList = nutrientlist;
    }
  }

