import {FFQItemInput} from './ffqitem-input';
import {FFQItemResponse, FoodType} from './ffqitem-response';
import {Serving} from './ffqitem-response';

export class FFQSugar {
  additionalSugar: boolean;
  teaspoons: number;

  constructor(additionalSugar: boolean, teaspoons: number) {
    this.additionalSugar = additionalSugar;
    this.teaspoons = teaspoons;
  } 
}
