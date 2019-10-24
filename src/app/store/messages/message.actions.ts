import { Action } from '@ngrx/store';
import { Message } from './message';

export enum MessageActionTypes {
  MessagesLoad = 'messages.load',
  MessagesLoadSuccess = 'messages.load.success',
  MessageAdd = 'message.add',
  MessageAddSuccess = 'conversation.add.success',
}

export type ConversationActions =
  MessagesLoad
  | MessagesLoadSuccess
  | MessagesAdd
  | MessaagesAddSuccess;

/* LOAD */
export class MessagesLoad implements Action {
  readonly type = MessageActionTypes.MessagesLoad;
}

export class MessagesLoadSuccess implements Action {
  readonly type = MessageActionTypes.MessagesLoadSuccess;

  constructor(public payload: Message[]) {
  }
}

/* ADD */
export class MessagesAdd implements Action {
  readonly type = MessageActionTypes.MessageAdd;

  constructor(public payload: Message) {
  }
}

export class MessaagesAddSuccess implements Action {
  readonly type = MessageActionTypes.MessageAddSuccess;

  constructor(public payload: Message) {
  }
}
