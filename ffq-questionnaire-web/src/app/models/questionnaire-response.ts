export class QuestionnaireResponse {
  id: string;
  exists: boolean;
  submitted: boolean;
  issuerId: string;

  constructor(id: string, exists: boolean, submitted: boolean, issuerId: string) {
    this.id = id;
    this.exists = exists;
    this.submitted = submitted;
    this.issuerId = issuerId;
  }
}
