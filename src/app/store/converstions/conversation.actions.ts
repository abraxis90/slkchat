import { Action } from '@ngrx/store';

import { Conversation, FirebaseConversation } from './conversation';
import { Message } from '../messages/message';

export enum ConversationActionTypes {
  ConversationLoad = 'conversation.load',
  ConversationLoadSuccess = 'conversation.load.success',
  ConversationAdd = 'conversation.add',
  ConversationAddSuccess = 'conversation.add.success',
  ConversationMessageSend = 'conversation.message.send',
  ConversationMessageSendSuccess = 'conversation.message.send.success'
}

export type ConversationActions =
  ConversationLoad
  | ConversationLoadSuccess
  | ConversationAdd
  | ConversationAddSuccess
  | ConversationMessageSend
  | ConversationMessageSendSuccesss;

/* LOAD */
export class ConversationLoad implements Action {
  readonly type = ConversationActionTypes.ConversationLoad;
}

export class ConversationLoadSuccess implements Action {
  readonly type = ConversationActionTypes.ConversationLoadSuccess;

  constructor(public payload: Conversation[]) {
  }
}

/* ADD */
export class ConversationAdd implements Action {
  readonly type = ConversationActionTypes.ConversationAdd;

  constructor(public payload: FirebaseConversation) {
  }
}

export class ConversationAddSuccess implements Action {
  readonly type = ConversationActionTypes.ConversationAddSuccess;
}

/* MESSAGE SEND */
export class ConversationMessageSend implements Action {
  readonly type = ConversationActionTypes.ConversationMessageSend;

  constructor(public payload: Message) {
  }
}

export class ConversationMessageSendSuccesss implements Action {
  readonly type = ConversationActionTypes.ConversationMessageSendSuccess;

  constructor(public payload: Conversation) {
  }
}
