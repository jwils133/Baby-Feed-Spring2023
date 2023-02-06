/*

  Added by Khalid Alamoudi
  This pipe is used in the recommended page in the clinician portal to filter the number of recommendations based on a keyword.
  Essentially, this serves as a search function.
  Recommendations can be searched by questionnaire ID or parent name.

*/

import { Pipe, PipeTransform } from '@angular/core';
import { FFQParentResult } from '../models/ffqparentresult';

@Pipe({
  name: 'recommendedFilter'
})
export class RecommendedFilterPipe implements PipeTransform {

  transform(list: any, resultMap: Map<string, FFQParentResult>, term: any): any {
    if(term === undefined)
    {
      return list;
    }
    return list.filter(function(result){  
      var questId = result.ffqresult.questionnaireId;
      var parentName = resultMap.get(result.ffqresult.userId).parentName;
      return questId.toLowerCase().includes(term.toLowerCase())
      || parentName.toLowerCase().includes(term.toLowerCase());
    });
  }


}
