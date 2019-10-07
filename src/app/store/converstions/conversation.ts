import { Message } from './message';
import { User } from '../users/user';

export class Conversation {

  constructor(public uid: string | undefined,
              public messages: Message[],
              public users: User[],
              public lastSent: number | undefined) {
  }
}
