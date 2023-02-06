import { FFQFoodItem } from './ffqfooditem';
import { FFQNutrientlist } from './ffqnutrientlist';
import { FFQFoodNutrientsResponse } from './ffqfoodnutrients-response';
import { FFQSugar } from './ffqsugar';
import { FFQFoodItemResponse } from './ffqfooditem-response';

export class FFQFoodNutrients {
    foodItem: FFQFoodItem;
    nutrientList: Array<FFQNutrientlist>;

    constructor(foodItem: FFQFoodItem, nutrientList: Array<FFQNutrientlist> ) {
        this.foodItem = foodItem;
        this.nutrientList = nutrientList;
    }

    public static foodItemToResponse(fooditem: FFQFoodNutrients): FFQFoodNutrientsResponse
    {
        const foodItemResponse = new FFQFoodItemResponse(fooditem.foodItem.name, fooditem.foodItem.id, fooditem.foodItem.itemPosition);

        // foodItemResponse.id = fooditem.foodItem.id;
        foodItemResponse.primary = fooditem.foodItem.primary;
        foodItemResponse.foodTypes = fooditem.foodItem.foodTypes;
        foodItemResponse.sugar = fooditem.foodItem.sugar;
        foodItemResponse.portionSize = fooditem.foodItem.portionSize;


        if (fooditem.foodItem.sugar != null) {
        foodItemResponse.sugar = fooditem.foodItem.sugar;
        }
        else{
            const sugar = new FFQSugar(false, 0);
            foodItemResponse.sugar = sugar;
        }

        foodItemResponse.servingsList = fooditem.foodItem.servingsList.split(',');

        for (const index in fooditem.nutrientList){
            fooditem.nutrientList[index].nutrientListID = foodItemResponse.foodTypes[index].nutrientListID;
        }



        const foodNutrientsResponse = new FFQFoodNutrientsResponse(foodItemResponse, fooditem.nutrientList);
        return foodNutrientsResponse;
    }
    public static foodItemFromResponse(response: FFQFoodNutrientsResponse): FFQFoodNutrients {
        const fooditem = new FFQFoodItem(response.foodItem.name, response.foodItem.itemPosition);

        fooditem.id = response.foodItem.id;
        fooditem.primary = response.foodItem.primary;
        fooditem.foodTypes = response.foodItem.foodTypes;
        fooditem.portionSize = response.foodItem.portionSize;

        if (response.foodItem.sugar != null) {
            fooditem.sugar = response.foodItem.sugar;
        }
        else{
            const sugar = new FFQSugar(false, 0);
            fooditem.sugar = sugar;
        }

        if (response.foodItem.servingsList != null){
            let servingsString = '';
            let index = response.foodItem.servingsList.length;
            for (const serving  of response.foodItem.servingsList){
                index--;
                if (index != 0) {
                    servingsString += serving['servingName'] + ", ";
                }
                else
                    servingsString += serving['servingName'];
            }
            fooditem.servingsList = servingsString;
        }



        // fooditem.servingsList = response.foodItem.servingsList;

        const foodnutrients = new FFQFoodNutrients(fooditem, response.nutrientList);

        return foodnutrients;
    }
}
