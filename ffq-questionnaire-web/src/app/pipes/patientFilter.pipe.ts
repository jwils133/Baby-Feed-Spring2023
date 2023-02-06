/*

  Added by Javier Romero
  This pipe is used in the users page in the clinician portal to count the number of patients assigned to a certain clinician.

*/

import { Pipe, PipeTransform } from '@angular/core';
import { FFQParent } from 'src/app/models/ffqparent';

@Pipe({
  name: 'patientFilter'
})
export class PatientPipe implements PipeTransform {

  transform(list: FFQParent[], username: any): any {
    if(username === undefined)
    {
      return list;
    }
    return list.filter(function(user){
      return user.assignedclinician === username;
    });
  }
}
