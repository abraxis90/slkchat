import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ChatDispatcherService } from '../../services/chat-dispatcher/chat-dispatcher.service';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { CONVERSATIONS_PATH, FirebaseConversation } from './conversation';
import {
  ConversationActionTypes,
  ConversationAdd,
  ConversationAddSuccess,
  ConversationMessageAdd,
  ConversationMessageAdded,
  ConversationMessageAddSuccess,
  ConversationMessageNoop,
  ConversationMessageQuery,
  ConversationQuery,
} from './conversation.actions';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { FirebaseMessage, MESSAGES_PATH } from '../messages/message';

@Injectable()
export class ConversationEffects {

  constructor(private readonly afs: AngularFirestore,
              private readonly auth: AuthenticationService,
              private actions$: Actions,
              private chatDispatcher: ChatDispatcherService) {}

  /* region CONVERSATIONS */

  @Effect()
  query$: Observable<Action> = this.actions$.pipe(
    ofType(ConversationActionTypes.ConversationQuery as string),
    switchMap((action: ConversationQuery) => {
      return this.afs.collection<FirebaseConversation>(
        CONVERSATIONS_PATH,
        ref => ref.where('userUids', 'array-contains', this.auth.state.value.uid)
      ).stateChanges();
    }),
    mergeMap(actions => actions),
    map(action => {
      return {
        type: `conversation.${action.type}`,
        payload: { uid: action.payload.doc.id, ...action.payload.doc.data() }
      };
    })
  );

  @Effect()
  addConversation = this.actions$
    .pipe(
      ofType(ConversationActionTypes.ConversationAdd as string),
      switchMap((action: ConversationAdd) => {
        const ref = this.afs.collection<FirebaseConversation>(CONVERSATIONS_PATH);
        const firebaseConversation = {
          userUids: action.payload.userUids
            .concat(this.auth.state.value.uid)
        };
        return from(ref.add(firebaseConversation));
      }),
      map(() => new ConversationAddSuccess())
    );

  /* endregion */

  /* region MESSAGES */

  @Effect()
  messageQuery$: Observable<Action> = this.actions$.pipe(
    ofType(ConversationActionTypes.ConversationMessageQuery as string),
    switchMap((action: ConversationMessageQuery) => {
      return this.afs.collection<FirebaseMessage>(
        `${CONVERSATIONS_PATH}/${action.payload}/${MESSAGES_PATH}`,
        ref => {
          return ref.orderBy('sentAt');
        }
      ).stateChanges();
    }),
    mergeMap(actions => actions),
    map(action => {
      return {
        type: `conversation.message.${action.type}`,
        payload: { uid: action.payload.doc.id, ...action.payload.doc.data() }
      };
    })
  );

  @Effect()
  conversationMessageAdded = this.actions$
    .pipe(
      ofType(ConversationActionTypes.ConversationMessageAdded as string),
      tap((action: ConversationMessageAdded) => {
        if (action.payload && action.payload.from === this.auth.state.value.uid) {
          this.chatDispatcher.messageFromOtherUser$.next(false);
        } else {
          this.chatDispatcher.messageFromOtherUser$.next(true);
        }
      }),
      map(() => {
        return new ConversationMessageNoop();
      })
    );

  @Effect()
  addMessage = this.actions$
    .pipe(
      ofType(ConversationActionTypes.ConversationMessageAdd as string),
      switchMap((action: ConversationMessageAdd) => {
        const ref = this.afs.collection<FirebaseMessage>(`${CONVERSATIONS_PATH}/${action.payload.conversationUid}/${MESSAGES_PATH}`);
        return from(ref.add(action.payload));
      }),
      map(() => {
        return new ConversationMessageAddSuccess();
      })
    );

  /* endregion */
}
