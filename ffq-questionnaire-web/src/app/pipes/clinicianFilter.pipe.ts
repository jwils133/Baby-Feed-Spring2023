/*

  Added by Javier Romero
  This pipe is used in the clinics page in the admin portal to count the number of clinicians assigned to a certain clinic.

*/

import { Pipe, PipeTransform } from '@angular/core';
import { FFQClinician } from 'src/app/models/ffqclinician';

@Pipe({
  name: 'clinicianFilter'
})
export class ClinicianPipe implements PipeTransform {

  transform(list: FFQClinician[], clinicId: any): any {
    if(clinicId === undefined)
    {
      return list;
    }
    return list.filter(function(user){
      return user.assignedclinic === clinicId;
    });
  }

}
