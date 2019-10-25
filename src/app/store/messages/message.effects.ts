import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { ChatDispatcherService } from '../chat-dispatcher.service';
import { MessageActionTypes, MessageAdd, MessageAddSuccess, MessagesLoad, MessagesLoadSuccess } from './message.actions';
import { selectMessagesLoading } from './message.selector';
import { Message } from './message';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Injectable()
export class MessageEffects {

  private messagesLoading$: Observable<boolean> = this.store.select(selectMessagesLoading);

  constructor(private actions$: Actions,
              private auth: AuthenticationService,
              private store: Store<{ messages: Message[] }>,
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
      withLatestFrom(this.messagesLoading$),
      map(([messages, messagesLoading]) => {
        if (messagesLoading) {
          return new MessagesLoadSuccess(messages);
        } else {
          // TODO consider loading X messages & separately subscribing to a stream of only the last message
          // only latest message
          const message = messages[messages.length - 1];
          if (message.from === this.auth.state.value.uid) {
            this.chatDispatcher.messageFromOtherUser$.next(false);
          } else {
            this.chatDispatcher.messageFromOtherUser$.next(true);
          }
          return new MessageAddSuccess(message);
        }
      })
    );

  @Effect()
  addMessage = this.actions$
    .pipe(
      ofType(MessageActionTypes.MessageAdd as string),
      switchMap((action: MessageAdd) => {
        return from(this.chatDispatcher.sendMessageToCurrentConversation(action.payload));
      }),
      map((message: Message) => {
        return new MessageAddSuccess(message);
      })
    );

}
