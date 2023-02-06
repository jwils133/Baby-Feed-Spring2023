export class FFQFoodRecommendations {
  questionnaireId: string;
  patientAge: number;
  foodCategoryRecList: Recommendation[];


  constructor(questionnaireId: string, patientAge: number, foodCategoryRecList: Recommendation[]) {
    this.questionnaireId = questionnaireId;
    this.patientAge = patientAge;
    this.foodCategoryRecList = foodCategoryRecList;
  }
}

export class Recommendation {
  categoryName: string;
  rangeFrom: number;
  rangeTo: number;
  label: string;
  calculatedAmount: number;

  constructor(categoryName: string, rangeFrom: number, rangeTo: number, label: string, calculatedAmount: number) {
    this.categoryName = categoryName;
    this.rangeFrom = rangeFrom;
    this.rangeTo = rangeTo;
    this.label = label;
    this.calculatedAmount = calculatedAmount;
  }
}
