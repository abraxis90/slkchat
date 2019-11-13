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
  ConversationAdd = 'conversation.add',
  ConversationAddSuccess = 'conversation.add.success',
  ConversationMessageLoad = 'conversation.message.load',
  ConversationMessageLoadSuccess = 'conversation.message.load.success',
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
  | ConversationMessageLoad
  | ConversationMessageLoadSuccess
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

/* LOAD */
export class ConversationMessageLoad implements Action {
  readonly type = ConversationActionTypes.ConversationMessageLoad;

  // load by conversationUid
  constructor(public payload: {
    conversationUid: string,
    lastMessage?: DocumentSnapshot<Message>
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

