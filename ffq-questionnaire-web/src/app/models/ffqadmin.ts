//Classed to store admin user data in components

export class FFQAdmin {
  id: string;
  userId: string;
  username: string;
  userpassword: string;
  usertype: string;
  firstname: string;
  lastname: string;
  isactive: boolean;


  constructor(userId: string, username: string, userpassword: string, usertype:string, firstname: string, lastname: string, isactive: boolean) {
    this.userId = userId;
    this.username = username;
    this.userpassword = userpassword;
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.isactive = isactive;
  }

}
