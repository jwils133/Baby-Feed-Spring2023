/*

  Added by Khalid Alamoudi
  This pipe is used in the tracker history page in the clinician portal to filter the number of tracker histories based on a keyword.
  Essentially, this serves as a search function.
  Histories can be searched by parent name.

*/

import { Pipe, PipeTransform } from '@angular/core';
import { TrackerParentResultsResponse } from '../models/ffqparentresulttracker';

@Pipe({
  name: 'trackerFilter'
})
export class TrackerFilterPipe implements PipeTransform {

 
  transform(list: any, resultMap: Map<string, TrackerParentResultsResponse>, term: any): any {
    if(term === undefined)
    {
      return list;
    }
    return list.filter(function(result){
      var parentName = resultMap.get(result.ffqtracker.userId).parentName;
      return parentName.toLowerCase().includes(term.toLowerCase());
    });
  }

}
