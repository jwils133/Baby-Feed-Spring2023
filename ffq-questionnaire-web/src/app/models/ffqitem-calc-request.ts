import {FFQItem} from './ffqitem';

export class FFQItemCalcRequest {
  name: string;
  frequency: number;
  frequencyType: string;
  nutrientListID: string;
  serving: string;
  sugar: number;

  public static calcRequestFromFoodItem(item: FFQItem): FFQItemCalcRequest {
    const request = new FFQItemCalcRequest();
    const input = item.input;
    // CHANGED 11/09: food item name must be consistent otherwise search by food item name will fail
    //let nameRaw = item.name;
    //const firstParen = nameRaw.indexOf('(');
    //if (firstParen > 0) {
      //nameRaw = nameRaw.substring(0, firstParen);
    //}
    //request.name = nameRaw;
    request.name = item.name;
    request.frequency = input.frequency;
    request.frequencyType = input.frequencyType;
    request.sugar = input.sugar === null ? 0 : input.sugar;
    if (input.serving === '') {
      request.serving = null;
    } else {
      request.serving = input.serving;
    }
    if (input.type === '') {
      request.nutrientListID = item.foodTypes[0].nutrientListID;
    } else {
      let id = '';
      for (const foodType of item.foodTypes) {
        if (input.type === foodType.typeName) {
          id = foodType.nutrientListID;
          break;
        }
      }
      if (id === '') {
        throw Error('Unable to resolve nutrientListID');
      } else {
        request.nutrientListID = id;
      }
    }

    return request;
  }

  toString(): string {
    return '{name: ' + this.name + ', frequency: ' + this.frequency + ', frequencyType: ' + this.frequencyType
      + ', nutrientListID: ' + this.nutrientListID + ', serving: ' + this.serving + ', sugar: ' + this.sugar + '}';
  }
}
