export class FFQResultsResponse {
  questionnaireId: string;
  userId: string;
  userType: string;
  date: string;
  patientName: string;
  feedback: string;
  ageInMonths: number;
  userChoices: any;
  weeklyTotals: any;
  dailyAverages: any;
  show: boolean;
  foodRecList: any;
  showFeedback: boolean;
  gender: string;
  assignedClinicOrSiteId: string;
  username?: string; // question mark means it's an optional parameter, here means it may not exist
  // userSearchName: string; // create userSearchName for clinian portal Questionnaire Results

  // tslint:disable-next-line:max-line-length
  constructor(id: string, userId: string, userType: string, date: string, name: string, age: number, userChoices: any, weeklyTotals: Map<string, number>, dailyAverages: any, feedback: string, gender: string, patientName: string) {
    this.questionnaireId = id;
    this.userId = userId;
    this.userType = userType;
    this.date = date;
    this.patientName = name;
    this.ageInMonths = age;
    this.userChoices = userChoices;
    this.weeklyTotals = weeklyTotals;
    this.dailyAverages = dailyAverages;
    this.feedback = feedback;
    this.gender = gender;
    this.patientName = patientName;
  }
}
