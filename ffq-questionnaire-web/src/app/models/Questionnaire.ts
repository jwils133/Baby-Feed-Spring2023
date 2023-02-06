export class Questionnaire {
  questionnaireID: string;
  userId: string;
  issuerID: string;
  date: string;
  submitted: boolean;
  patientName: string;

  constructor(questionnaireID: string, userId: string, issuerID: string, date: string, submitted: boolean, patientName: string) {
    this.questionnaireID = questionnaireID;
    this.userId = userId;
    this.issuerID = issuerID;
    this.date = date;
    this.submitted = submitted;
    this.patientName = patientName;
  }

}
