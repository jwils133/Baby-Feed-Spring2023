import { FFQClinician } from 'src/app/models/ffqclinician';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQAdmin } from 'src/app/models/ffqadmin';

export class User {
    id: string;
    ffqclinician?: FFQClinician;
    ffqparent?: FFQParent;
    ffqadmin?: FFQAdmin;
    userType: string;  // Could be Admin, Parent, or Clinician   userType="clinician"  dbo.getcollection("clinicians") ==> ffqclinician.
    token?: string;
}

class Admin {

    adminId: number;
    username: string;
    userpassword: string;
    firstname: string;
    lastName: string;
}


/*
export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
}
*/
