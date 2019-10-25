import { Action } from '@ngrx/store';
import { FirebaseMessage, Message } from './message';

export enum MessageActionTypes {
  MessagesLoad = 'messages.load',
  MessagesLoadSuccess = 'messages.load.success',
  MessageAdd = 'message.add',
  MessageAddSuccess = 'conversation.add.success',
}

export type MessageActions =
  MessagesLoad
  | MessagesLoadSuccess
  | MessageAdd
  | MessageAddSuccess;

/* LOAD */
export class MessagesLoad implements Action {
  readonly type = MessageActionTypes.MessagesLoad;

  // load by conversationUid
  constructor(public payload: string) {}
}

export class MessagesLoadSuccess implements Action {
  readonly type = MessageActionTypes.MessagesLoadSuccess;

  constructor(public payload: Message[]) {
  }
}

/* ADD */
export class MessageAdd implements Action {
  readonly type = MessageActionTypes.MessageAdd;

  constructor(public payload: FirebaseMessage) {
  }
}

export class MessageAddSuccess implements Action {
  readonly type = MessageActionTypes.MessageAddSuccess;

  constructor(public payload: Message) {
  }
}
