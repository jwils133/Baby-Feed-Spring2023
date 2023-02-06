/*

  Added by Javier Romero
  This pipe is used in several pages to filter the number of users based on a keyword.
  Essentially, this serves as a search function.
  Users can be searched by username, first and last name, role and name, and last and first name.

*/

import { Pipe, PipeTransform } from '@angular/core';
import { FFQClinicianResponse } from '../models/ffqclinician-response';

@Pipe({
  name: 'searchFilter'
})
export class SearchPipe implements PipeTransform {

  transform<T>(list: T[], term: any): T[] {
    if(term === undefined)
    {
      return list;
    }
    return list.filter((obj) => Object.keys(obj).filter(key => obj.hasOwnProperty(key)).find(key =>
        obj[key]?.toString().toLowerCase().includes(term?.toLowerCase())
      )
    );
  }
}
