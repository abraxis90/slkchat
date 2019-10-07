import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { ConversationDispatcherService } from './conversation-dispatcher.service';
import { UserDispatcherService } from '../users/user-dispatcher.service';
import { ConversationActionTypes, ConversationAdd, ConversationAddSuccess } from './conversation.actions';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Conversation } from './conversation';

@Injectable()
export class ConversationEffects {

  constructor(private actions$: Actions,
              private userDispatcher: UserDispatcherService,
              private conversationDispatcher: ConversationDispatcherService) {}

  @Effect()
  addConversation = this.actions$
    .pipe(
      ofType(ConversationActionTypes.ConversationAdd as string),
      switchMap((action: ConversationAdd) => {
        // add conversation to firebase & convert returned promise to Observable
        return from(this.conversationDispatcher.createConversation(action.payload)
          .then(conversationDocument => {
            // use conversationDocument id to get uid
            return new Conversation(conversationDocument.id, [], action.payload.users, undefined);
          }));
      }),
      map((conversation: Conversation) => {
        return new ConversationAddSuccess(conversation);
      })
    );
}
