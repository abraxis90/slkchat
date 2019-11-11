import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { from } from 'rxjs';

import { ChatDispatcherService } from '../../services/chat-dispatcher/chat-dispatcher.service';
import { MessageActionTypes, MessageAdd, MessageAddSuccess, MessageNoop, MessagesLoad, MessagesLoadSuccess } from './message.actions';
import { Message } from './message';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Injectable()
export class MessageEffects {

  constructor(private actions$: Actions,
              private auth: AuthenticationService,
              private store: Store<{ messages: Message[] }>,
              private chatDispatcher: ChatDispatcherService) {}

  @Effect()
  loadMessages = this.actions$
    .pipe(
      ofType(MessageActionTypes.MessagesLoad as string),
      switchMap((action: MessagesLoad) => {
        return this.chatDispatcher.loadCurrentMessageCollection(action.payload);
      }),
      map((messages: Message[]) => {
        return new MessageAddSuccess(messages);
      })
    );

  @Effect()
  addMessage = this.actions$
    .pipe(
      ofType(MessageActionTypes.MessageAdd as string),
      switchMap((action: MessageAdd) => {
        return from(this.chatDispatcher.sendMessageToCurrentConversation(action.payload));
      }),
      map(() => {
        return new MessageNoop();
      })
    );

  @Effect()
  addMessageSuccess = this.actions$
    .pipe(
      ofType(MessageActionTypes.MessageAddSuccess as string),
      tap((action: MessageAddSuccess) => {
        if (action.payload.length && action.payload[action.payload.length - 1].from === this.auth.state.value.uid) {
          this.chatDispatcher.messageFromOtherUser$.next(false);
        } else {
          this.chatDispatcher.messageFromOtherUser$.next(true);
        }
      }),
      map(() => {
        return new MessageNoop();
      })
    );

}
