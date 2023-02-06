//Class used to store questionnaire result added to it the parentName associated with their respective questionnaires in order
// to display it in the clinic-tracker-history component

import { TrackerResultsResponse } from './trackerresultsresponse';

export class TrackerParentResultsResponse {
    ffqtracker: TrackerResultsResponse;
    parentName: string;
  
    constructor(ffqtracker: TrackerResultsResponse, parentName: string) {
      this.ffqtracker = ffqtracker;
      this.parentName = parentName;
    }
  }