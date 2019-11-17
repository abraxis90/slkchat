import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { debounceTime, first, map, mergeMap, switchMap } from 'rxjs/operators';
import { combineLatest, from, Observable, of } from 'rxjs';

import { Conversation, CONVERSATIONS_PATH, FirebaseConversation } from './conversation';
import {
  ConversationActionTypes,
  ConversationAdd,
  ConversationAddSuccess,
  ConversationMessageAdd,
  ConversationMessageAddSuccess,
  ConversationMessageLoad,
  ConversationMessageLoadSuccess,
  ConversationMessageQueryAll,
  ConversationQuery,
} from './conversation.actions';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { FirebaseMessage, Message, MESSAGES_PATH } from '../messages/message';
import { selectConversationIds } from './conversation.selector';

@Injectable()
export class ConversationEffects {

  constructor(private readonly afs: AngularFirestore,
              private readonly auth: AuthenticationService,
              private readonly store: Store<Conversation>,
              private actions$: Actions) {}

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
        payload: {
          uid: action.payload.doc.id,
          ...action.payload.doc.data(),
          messages: [],
          oldMessages: [],
          opened: false
        }
      };
    })
  );

  @Effect()
  addConversation$ = this.actions$
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
  messageLoad$: Observable<Action> = this.actions$.pipe(
    ofType(ConversationActionTypes.ConversationMessageLoad as string),
    switchMap((action: ConversationMessageLoad) => {
      const docPath = `${CONVERSATIONS_PATH}/${action.payload.conversationUid}/${MESSAGES_PATH}/${action.payload.lastMessageUid}`;

      const snapshotChanges = this.afs.doc(docPath).snapshotChanges()
        .pipe(
          map(change => {
            return change.payload;
          }),
          switchMap(lastMessageSnapshot => {
            return this.afs.collection<FirebaseMessage>(
              `${CONVERSATIONS_PATH}/${action.payload.conversationUid}/${MESSAGES_PATH}`,
              ref => {
                return ref
                  .orderBy('sentAt', 'desc')
                  .startAfter(lastMessageSnapshot)
                  .limit(50);
              }
            ).snapshotChanges(['added']).pipe(first());
          }),
          first()
        );

      return combineLatest([snapshotChanges, of(action.payload.conversationUid)]);
    }),
    map(([messageChangeActions, conversationUid]) => {
      const messages = messageChangeActions.map((messageChangeAction: DocumentChangeAction<FirebaseMessage>) => {
        const messageData: FirebaseMessage = messageChangeAction.payload.doc.data();
        return new Message(
          messageChangeAction.payload.doc.id,
          messageData.conversationUid,
          messageData.body,
          messageData.from,
          undefined,
          messageData.sentAt);
      });
      return new ConversationMessageLoadSuccess({
        conversationUid: conversationUid,
        messages: messages
      });
    })
  );

  // TODO: handle newly added/removed conversations properly; perhaps merge with conversation querying
  @Effect()
  latestMessagesQuery$: Observable<Action> = this.actions$.pipe(
    ofType(ConversationActionTypes.ConversationMessageQueryAll),
    switchMap((action: ConversationMessageQueryAll) => {
      return this.store.select(selectConversationIds).pipe(debounceTime(100));
    }),
    switchMap((conversationIds: string[]) => {
      return conversationIds.map(id => {
        return this.afs.collection(
          `${CONVERSATIONS_PATH}/${id}/${MESSAGES_PATH}`,
          ref => {
            return ref
              .orderBy('sentAt', 'desc')
              .limit(50);
          }
        ).stateChanges();
      });
    }),
    mergeMap(actions => actions),
    mergeMap(actions => actions),
    map((action: DocumentChangeAction<Message>) => {
      return {
        type: `conversation.message.${action.type}`,
        payload: { uid: action.payload.doc.id, ...action.payload.doc.data() }
      };
    })
  );

  @Effect()
  addMessage$ = this.actions$
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
