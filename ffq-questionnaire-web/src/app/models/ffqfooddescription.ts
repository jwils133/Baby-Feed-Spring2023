export class Description {
  _id: any;
  imageUrl: string;
  foodItemGroupName: string;
  firstBracketIntake: string;
  secondBracketIntake: string;
  thirdBracketIntake: string;
  description: string;

  constructor(_id: any, imageUrl: string, foodItemGroupName: string, firstBracketIntake: string, secondBracketIntake: string,
              thirdBracketIntake: string, description: string) {
    this._id = _id;
    this.imageUrl = imageUrl;
    this.foodItemGroupName = foodItemGroupName;
    this.firstBracketIntake = firstBracketIntake;
    this.secondBracketIntake = secondBracketIntake;
    this.thirdBracketIntake = thirdBracketIntake;
    this.description = description;
  }
}
