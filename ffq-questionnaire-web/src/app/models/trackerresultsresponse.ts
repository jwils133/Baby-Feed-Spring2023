export class TrackerResultsResponse {
  _id: string;
  userId: string;
  age: number;
  date: string;
  responses: any;
  goal: string;

  constructor(userId: string, age: number, date: string, responses: any) {
    this.userId = userId;
    this.age = age;
    this.date = date;
    this.responses = responses;

    // On initial creation there is no goal
    this.goal = "";
  }
}
