import { Action } from '@ngrx/store';
import { FirebaseMessage, Message } from './message';

export class MessageNoop implements Action {
  readonly type = 'message.noop';
}

export enum MessageActionTypes {
  MessagesLoad = 'messages.load',
  MessagesLoadSuccess = 'messages.load.success',
  MessageUpsertsLoad = 'messages.load.upserts',
  MessageAdd = 'message.add',
  MessageAddSuccess = 'message.add.success'
}

export type MessageActions =
  MessagesLoad
  | MessagesLoadSuccess
  | MessageUpsertsLoad
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

export class MessageUpsertsLoad implements Action {
  readonly type = MessageActionTypes.MessageUpsertsLoad;

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

  constructor(public payload: Message[]) {
  }
}
