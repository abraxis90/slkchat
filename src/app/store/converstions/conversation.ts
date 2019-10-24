import { Message } from '../messages/message';
import { User } from '../users/user';

export const CONVERSATIONS_PATH = 'CONVERSATIONS';

export class Conversation {

  constructor(public uid: string | undefined,
              public users: User[],
              public lastSent: number | undefined) {
  }
}
