import { Message } from '../messages/message';
import { User } from '../users/user';

export const CONVERSATIONS_PATH = 'CONVERSATIONS';

export interface FirebaseConversation {
  users: string[];
}

export class Conversation {

  constructor(public uid: string | undefined,
              public users: User[]) {
  }
}
