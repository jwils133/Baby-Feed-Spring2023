import {FFQItemResponse} from './ffqitem-response';
import { ObjectUnsubscribedError } from 'rxjs';
import { FFQClinician } from './ffqclinician';
import { FFQParent } from './ffqparent';
import { FFQClinic } from './ffqclinic';
import { FFQClinicianResponse } from './ffqclinician-response';
import { FFQParentResponse } from './ffqparent-response';
import { FFQClinicResponse } from './ffqclinic-response';

export class FFQUserMap {
  ffqclinician: FFQClinicianResponse[];
  ffqparent: FFQParentResponse[];
  ffqclinic: FFQClinicResponse[];


  constructor(ffqclinician: FFQClinicianResponse[], ffqparent: FFQParentResponse[], ffqclinic: FFQClinicResponse[]) {
    this.ffqclinician = ffqclinician;
    this.ffqparent = ffqparent;
    this.ffqclinic = ffqclinic;
  }

}
