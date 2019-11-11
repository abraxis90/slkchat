import { Action } from '@ngrx/store';

import { Conversation, FirebaseConversation } from './conversation';

export enum ConversationActionTypes {
  ConversationQuery = 'conversation.query',
  ConversationAdded = 'conversation.added',
  ConversationModified = 'conversation.modified',
  ConversationAdd = 'conversation.add',
  ConversationAddSuccess = 'conversation.add.success',
}

export type ConversationActions =
  ConversationQuery
  | ConversationAdded
  | ConversationModified
  | ConversationAdd
  | ConversationAddSuccess;

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

/* ADD */
export class ConversationAdd implements Action {
  readonly type = ConversationActionTypes.ConversationAdd;

  constructor(public payload: FirebaseConversation) {}
}

export class ConversationAddSuccess implements Action {
  readonly type = ConversationActionTypes.ConversationAddSuccess;
}
