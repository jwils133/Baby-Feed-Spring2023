// Classed to store admin user data in components

export class FFQResearcher {
  id: string;
  userId: string;
  username: string;
  userpassword: string;
  usertype: string;
  firstname: string;
  lastname: string;
  isactive: boolean;
  assignedResearchInstitutionId: string;
  limitNumberOfParticipants: number;
  prefix: string;


  constructor(userId: string, username: string, userpassword: string, usertype: string, firstname: string, lastname: string, isactive: boolean, assignedResearchInstitutionId: string, limitNumberOfParticipants: number, prefix: string) {
    this.userId = userId;
    this.username = username;
    this.userpassword = userpassword;
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.assignedResearchInstitutionId = assignedResearchInstitutionId;
    this.limitNumberOfParticipants = limitNumberOfParticipants;
    this.isactive = isactive;
    this.prefix = prefix;

  }

}
