import { ObjectUnsubscribedError } from 'rxjs';

export class FFQUserResponse {
  userId: string;
  username: string;

  constructor(userId: string, username: string) {
    this.userId = userId;
    this.username = username;
  
  }

}

