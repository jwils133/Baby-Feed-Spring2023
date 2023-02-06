//Class used for to user that will be authenticated in the authentication service

export class User {
  id: string;
  username: string;
  userpassword: string;
  userType: string;
  token?: string;

  constructor(id: string, username: string, userpassword: string, userType: string, token?: string) {
    this.id = id;
    this.username = username;
    this.userpassword = userpassword;
    this.userType = userType;
    this.token = token;
  }
}


