export class FFQClinic {
  id: string;
  clinicId: string;
  address: string;
  datebuilt: string;
  clinicname: string;
  headclinician: string;
  isactive: boolean;
  cliniciansLimit: number;
  parentsLimit: number;


  constructor(clinicId: string,
              address: string,
              datebuilt: string,
              clinicname: string,
              headclinician: string,
              isactive: boolean,
              cliniciansLimit: number,
              parentsLimit: number) {
    this.clinicId = clinicId;
    this.address = address;
    this.datebuilt = datebuilt;
    this.clinicname = clinicname;
    this.headclinician = headclinician;
    this.isactive = isactive;
    this.cliniciansLimit = cliniciansLimit;
    this.parentsLimit = parentsLimit;
  }

}
