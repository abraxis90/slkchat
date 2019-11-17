import { Action } from '@ngrx/store';

import { Conversation, FirebaseConversation } from './conversation';
import { FirebaseMessage, Message } from '../messages/message';
import { DocumentSnapshot } from '@angular/fire/firestore';

export class ConversationMessageNoop implements Action {
  readonly type = 'conversation.message.noop';
}

export enum ConversationActionTypes {
  ConversationQuery = 'conversation.query',
  ConversationAdded = 'conversation.added',
  ConversationModified = 'conversation.modified',
  ConversationOpened = 'conversation.opened',
  ConversationClosed = 'conversation.closed',
  ConversationAdd = 'conversation.add',
  ConversationAddSuccess = 'conversation.add.success',
  ConversationMessageLoad = 'conversation.message.load',
  ConversationMessageLoadSuccess = 'conversation.message.load.success',
  ConversationMessageDump = 'conversation.message.dump',
  ConversationMessageQueryAll = 'conversation.message.query.all',
  ConversationMessageAdded = 'conversation.message.added',
  ConversationMessageAdd = 'conversation.message.add',
  ConversationMessageAddSuccess = 'conversation.message.add.success'
}

export type ConversationActions =
  ConversationQuery
  | ConversationAdded
  | ConversationModified
  | ConversationOpened
  | ConversationClosed
  | ConversationAdd
  | ConversationAddSuccess
  | ConversationMessageLoad
  | ConversationMessageLoadSuccess
  | ConversationMessageDump
  | ConversationMessageQueryAll
  | ConversationMessageAdded
  | ConversationMessageAdd
  | ConversationMessageAddSuccess;

/* region CONVERSATION */

/* QUERY */
export class ConversationQuery implements Action {
  readonly type = ConversationActionTypes.ConversationQuery;
}

/* ADDED */
export class ConversationAdded implements Action {
  readonly type = ConversationActionTypes.ConversationAdded;

  constructor(public payload: Conversation) {}
}

/* MODIFIED */
export class ConversationModified implements Action {
  readonly type = ConversationActionTypes.ConversationModified;

  constructor(public payload: Conversation) {}
}

/* OPENED */
export class ConversationOpened implements Action {
  readonly type = ConversationActionTypes.ConversationOpened;

  constructor(public payload: string) {}
}

/* CLOSED */
export class ConversationClosed implements Action {
  readonly type = ConversationActionTypes.ConversationClosed;

  constructor(public payload: string) {}
}

/* ADD */
export class ConversationAdd implements Action {
  readonly type = ConversationActionTypes.ConversationAdd;

  constructor(public payload: FirebaseConversation) {}
}

export class ConversationAddSuccess implements Action {
  readonly type = ConversationActionTypes.ConversationAddSuccess;
}

/* endregion */

/* region CONVERSATION MESSAGES */

/* LOAD */
export class ConversationMessageLoad implements Action {
  readonly type = ConversationActionTypes.ConversationMessageLoad;

  // load by conversationUid
  constructor(public payload: {
    conversationUid: string,
    lastMessageUid?: string
  }) {}
}

/* LOAD SUCCESS */
export class ConversationMessageLoadSuccess implements Action {
  readonly type = ConversationActionTypes.ConversationMessageLoadSuccess;

  constructor(public payload: {
    conversationUid: string,
    messages: Message[]
  }) {}
}

/* DUMP */
export class ConversationMessageDump implements Action {
  readonly type = ConversationActionTypes.ConversationMessageDump;

  constructor(public payload: string) {}
}

/* QUERY */
export class ConversationMessageQueryAll implements Action {
  readonly type = ConversationActionTypes.ConversationMessageQueryAll;
}

/* ADDED */
export class ConversationMessageAdded implements Action {
  readonly type = ConversationActionTypes.ConversationMessageAdded;

  constructor(public payload: Message) {}
}

/* ADD */
export class ConversationMessageAdd implements Action {
  readonly type = ConversationActionTypes.ConversationMessageAdd;

  constructor(public payload: FirebaseMessage) {}
}

export class ConversationMessageAddSuccess implements Action {
  readonly type = ConversationActionTypes.ConversationMessageAddSuccess;
}


/* endregion */

