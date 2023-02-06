export class FFQItemInput {
  frequency: number;
  frequencyType: string;
  serving: string;
  type: string;
  sugar: number;

  constructor() {
    this.frequency = null;
    this.frequencyType = '';
    this.serving = '';
    this.type = '';
    this.sugar = null;
  }
}
