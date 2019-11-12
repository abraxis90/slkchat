import { Action } from '@ngrx/store';

import { Conversation, FirebaseConversation } from './conversation';
import { FirebaseMessage, Message } from '../messages/message';

export class ConversationMessageNoop implements Action {
  readonly type = 'conversation.message.noop';
}

export enum ConversationActionTypes {
  ConversationQuery = 'conversation.query',
  ConversationAdded = 'conversation.added',
  ConversationModified = 'conversation.modified',
  ConversationAdd = 'conversation.add',
  ConversationAddSuccess = 'conversation.add.success',
  ConversationMessageLoad = 'conversation.message.load',
  ConversationMessageLoadSuccess = 'conversation.message.success',
  ConversationMessageQuery = 'conversation.message.query',
  ConversationMessageQueryLast = 'conversation.message.query.last',
  ConversationMessageAdded = 'conversation.message.added',
  ConversationMessageAdd = 'conversation.message.add',
  ConversationMessageAddSuccess = 'conversation.message.add.success'
}

export type ConversationActions =
  ConversationQuery
  | ConversationAdded
  | ConversationModified
  | ConversationAdd
  | ConversationAddSuccess
  | ConversationMessageQuery
  | ConversationMessageQueryLast
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

/* QUERY */
export class ConversationMessageQuery implements Action {
  readonly type = ConversationActionTypes.ConversationMessageQuery;

  // load by conversationUid
  constructor(public payload: string) {}
}

export class ConversationMessageQueryLast implements Action {
  readonly type = ConversationActionTypes.ConversationMessageQueryLast;
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

