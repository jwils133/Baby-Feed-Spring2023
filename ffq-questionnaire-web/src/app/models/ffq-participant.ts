//Classed to store admin user data in components

export class FfqParticipant {
  id: string;
  userId: string;
  username: string;
  userpassword: string;
  usertype: string;
  firstname: string;
  lastname: string;
  assignedResearcherInst: string;
  assignedResearcherUsers: string[];
  childrennames: string[];
  isactive: boolean;
  prefix: string;
  assignedClinicOrSiteId: string;
  children: any;

  constructor(
    userId: string,
    username: string,
    userpassword: string,
    usertype: string,
    firstname: string,
    lastname: string,
    assignedResearcherInst: string,
    assignedResearcherUsers: string[],
    childrennames: string[],
    isactive: boolean,
    prefix: string,
    children: any
  ) {
    this.userId = userId;
    this.username = username;
    this.userpassword = userpassword;
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.assignedResearcherInst = assignedResearcherInst;
    this.assignedResearcherUsers = assignedResearcherUsers;
    this.childrennames = childrennames;
    this.isactive = isactive;
    this.prefix = prefix;
    this.children = children;
  }
}
