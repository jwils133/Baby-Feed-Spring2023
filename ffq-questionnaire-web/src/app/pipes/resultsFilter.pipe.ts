/*

  Added by Javier Romero, edited by Khalid Alamoudi
  This pipe is used in the questionnaire results page in the clinician portal to filter the number of results based on a keyword.
  Essentially, this serves as a search function.
  Results can be searched by questionnaire ID, parent name or patient name.

*/

import {Pipe, PipeTransform} from '@angular/core';
import {FFQParent} from '../models/ffqparent';
import {ParentService} from '../services/parent/parent-service';
import {FFQParentResult} from '../models/ffqparentresult';
import {TrackerParentResultsResponse} from '../models/ffqparentresulttracker';

@Pipe({
  name: 'resultsFilter'
})


export class ResultsPipe implements PipeTransform {

  transform(list: any, resultMap: Map<string, FFQParentResult>, term: any): any {
    if (term === undefined) {
      return list;
    }
    const res = list.filter(function (result) {
      const patientName = result.ffqresult.patientName;
      return patientName.toLowerCase().includes(term.toLowerCase());
    });
    return res;
  }


}
