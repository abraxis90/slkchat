import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { ChatDispatcherService } from '../chat-dispatcher.service';
import { map, switchMap } from 'rxjs/operators';
import { MessageActionTypes, MessagesLoad, MessagesLoadSuccess } from './message.actions';
import { Message } from './message';

@Injectable()
export class MessageEffects {

  constructor(private actions$: Actions,
              private chatDispatcher: ChatDispatcherService) {}

  @Effect()
  loadMessages = this.actions$
    .pipe(
      ofType(MessageActionTypes.MessagesLoad as string),
      switchMap((action: MessagesLoad) => {
        const conversationUid = action.payload;
        this.chatDispatcher.dropCurrentMessageCollection();
        return this.chatDispatcher.loadCurrentMessageCollection(conversationUid);
      }),
      map((messages: Message[]) => {
        return new MessagesLoadSuccess(messages);
      })
    );

  // @Effect()
  // addConversation = this.actions$
  //   .pipe(
  //     ofType(ConversationActionTypes.ConversationAdd as string),
  //     switchMap((action: ConversationAdd) => {
  //       // add conversation to firebase & convert returned promise to Observable
  //       return from(this.conversationDispatcher.createConversation(action.payload)
  //         .then(conversationDocument => {
  //           // use conversationDocument id to get uid
  //           return new Conversation(conversationDocument.id, action.payload.users, undefined);
  //         }));
  //     }),
  //     map((conversation: Conversation) => {
  //       return new ConversationAddSuccess(conversation);
  //     })
  //   );
}
