//Class used to store admin user data from response

export class FFQResearchInstitution {
  id: string;
  researchInstitutionId: string;
  address: string;
  createdDate: string;
  institutionName: string;
  siteType: string;
  participantsLimit: number;


  constructor(researchInstitutionId: string, address: string, createdDate: string, institutionName: string, siteType: string, participantsLimit: number) {
    this.researchInstitutionId = researchInstitutionId;
    this.address = address;
    this.createdDate = createdDate;
    this.institutionName = institutionName;
    this.siteType = siteType;
    this.participantsLimit = participantsLimit;
  }
}
