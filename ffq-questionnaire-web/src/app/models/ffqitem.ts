import { FFQItemInput } from './ffqitem-input';
import { FFQItemResponse, FoodType } from './ffqitem-response';
import { Serving } from './ffqitem-response';

export class FFQItem {
  name: string;
  servingOptions: string[];
  types: string[];
  hasSugarSetting: boolean;
  disabled: boolean;
  input: FFQItemInput;
  isSubmitted: boolean;
  isPrimary: boolean;
  foodTypes: FoodType[];
  itemPosition: number;

  constructor(name: string) {
    this.name = name;
    this.servingOptions = [];
    this.types = [];
    this.hasSugarSetting = false;
    this.disabled = false;
    this.input = new FFQItemInput();
    this.isSubmitted = false;
    this.isPrimary = false;
    this.foodTypes = [];
    this.itemPosition = -1;
  }

  public static foodItemFromResponse(response: FFQItemResponse): FFQItem {
    const item = new FFQItem(response.name);
    item.name = response.name;
    item.servingOptions =
      response.servingsList.length > 1 ? this.handleServingsList(response.servingsList) : [];
    item.foodTypes = response.foodTypes;
    item.types =
      response.foodTypes.length > 1 ? this.handleFoodTypesList(response.foodTypes) : [];
    if (response.sugar != null) {
      item.hasSugarSetting = response.sugar.additionalSugar;
    }
    item.isPrimary = response.primary;
    /////
    item.itemPosition = response.itemPosition;
    /////
    return item;
  }

  private static handleServingsList(servings: Serving[]): string[] {
    const servingsList: string[] = [];
    for (const s of servings) {
      servingsList.push(s.servingName);
    }
    return servingsList;
  }

  private static handleFoodTypesList(foodTypes: FoodType[]) {
    const typesList: string[] = [];
    for (const t of foodTypes) {
      typesList.push(t.typeName);
    }
    return typesList;
  }

  toString(): string {
    return `{ name:${this.name}, servings:[` + this.servingsOptionsToString() + '], '
      + 'types: [' + this.typeOptionsToString() + '], hasSugarSetting: ' + this.hasSugarSetting + ', enabled: ' + !this.disabled
      + ', input: {frequency: ' + this.input.frequency + ', frequencyType: ' + this.input.frequencyType
      + ', serving: ' + (this.input.serving === '' ? 'default' : this.input.serving)
      + ', type: ' + (this.input.type === '' ? 'default' : this.input.type)
      + ', sugar: ' + this.input.sugar + '} }';
  }

  private servingsOptionsToString(): string {
    let str = '';
    for (const s of this.servingOptions) {
      str += s + ',';
    }
    if (str.length > 0) {
      return str;
    } else {
      return str.slice(0, -1);
    }
  }

  private typeOptionsToString() {
    let str = '';
    for (const s of this.types) {
      str += s + ',';
    }
    if (str.length > 0) {
      return str;
    } else {
      return str.slice(0, -1);
    }
  }

  public getErrorState(): string[] {
    const errorStates: string[] = [];

    if (this.input.frequency !== null && this.input.frequency < 1 
      || (this.input.frequency > 12 && this.name === 'Breast milk' ) || (this.input.frequency > 12 && this.name === 'Infant Formula')) {
      errorStates.push('frequency-range');
    }

    if (this.input.frequency === null
      || (this.input.frequencyType.toLowerCase() !== 'day'
        && this.input.frequencyType.toLowerCase() !== 'week')) {
      errorStates.push('frequency');
    }

    if (this.servingOptions.length > 0 && !this.servingOptions.includes(this.input.serving)) {
      errorStates.push('serving');
    }

    if (this.types.length > 0 && !this.types.includes(this.input.type)) {
      errorStates.push('type');
    }

    return errorStates;
  }

  /** 
  public limitFrequency(): string[]{
    const errorStates: string[] = [];
    if(this.input.frequency !== null && this.input.frequency > 12){
      errorStates.push('frequency-range');
    }
    return errorStates;
  }
  */

}
