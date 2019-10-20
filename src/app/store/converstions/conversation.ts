import { Message } from './message';
import { User } from '../users/user';

export const CONVERSATIONS_PATH = 'CONVERSATIONS';
export const MESSAGES_PATH = 'MESSAGES';
// TODO: maybe consider decoupling users from conversations or to move the way we load conversations entirely
export class Conversation {

  constructor(public uid: string | undefined,
              public messages: Message[],
              public users: User[],
              public lastSent: number | undefined) {
  }
}
