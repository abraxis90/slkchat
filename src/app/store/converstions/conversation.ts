import { Message } from '../messages/message';
import { User } from '../users/user';

export const CONVERSATIONS_PATH = 'CONVERSATIONS';

export interface FirebaseConversation {
  userUids: string[];
}

export interface ConversationWithUsers extends Conversation {
  users: User[];
}

export class Conversation implements FirebaseConversation {

  constructor(public uid: string | undefined,
              public userUids: string[],
              public messages: Message[]) {
  }
}
