import { Message } from './message';
import { User } from '../users/user';

export const CONVERSATIONS_PATH = 'CONVERSATIONS';
export const MESSAGES_PATH = 'MESSAGES';

export class Conversation {

  constructor(public uid: string | undefined,
              public messages: Message[],
              public users: User[],
              public lastSent: number | undefined) {
  }
}
