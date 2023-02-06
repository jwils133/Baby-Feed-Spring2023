
export class FFQItemResponse {
  name: string;
  primary: boolean;
  servingsList: Serving[];
  foodTypes: FoodType[];
  sugar: SugarSetting;
  itemPosition: number;

  constructor(name: string, primary: boolean, servingsList: Serving[], foodTypes: FoodType[], sugar: SugarSetting, itemPosition: number) {
    this.name = name;
    this.primary = primary;
    this.servingsList = servingsList;
    this.foodTypes = foodTypes;
    this.sugar = sugar;
    this.itemPosition = itemPosition;
  }
}

export class FoodType {
  typeName: string;
  nutrientListID: string;
}

export class SugarSetting {
  additionalSugar: boolean;
  teaspoons: number;
}

export class Serving {
  servingName: string;
}
