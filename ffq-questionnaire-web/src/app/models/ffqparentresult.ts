//Class used to store questionnaire result added to it the parentName associated with their respective questionnaires in order
// to display it in the clinic-quest-result and clinic-recommend components

import {FFQResultsResponse} from './ffqresultsresponse';

export class FFQParentResult {
  /* questionnaireId: string;
   userId: string;
   patientName: string;
   ageInMonths: number;
   userChoices: any;
   weeklyTotals: any;
   dailyAverages: any;
   show: boolean;*/
  ffqresult: FFQResultsResponse;
  parentName: string;
  assignedClinicOrSiteId: string;

  constructor(ffqresult: FFQResultsResponse, parentName: string) {

    this.ffqresult = ffqresult;
    this.parentName = parentName;
  }
}
