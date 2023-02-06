//Classed to store parent user data in components

export class FFQResearcherParent {
  id: string;
  userId: string;
  username: string;
  firstname: string;
  usertype: string;
  lastname: string;
  assignedResearcherOrg: string;
  assignedResearcherUser: any;
  childrennames: any;
  isactive: boolean;
  userpassword: string;


  constructor(userId: string, username: string, userpassword: string, usertype:string, firstname: string, 
              lastname: string, assignedResearcherOrg: string, assignedResearcherUser: any, childrennames: any, isactive: boolean) {
    this.userId = userId;
    this.username = username;
    this.userpassword = userpassword;
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.assignedResearcherOrg = assignedResearcherOrg;
    this.assignedResearcherUser = assignedResearcherUser;
    this.childrennames = childrennames;
    this.isactive = isactive;
  }

}
