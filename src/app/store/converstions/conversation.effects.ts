import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ChatDispatcherService } from '../../services/chat-dispatcher/chat-dispatcher.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { CONVERSATIONS_PATH, FirebaseConversation } from './conversation';
import { ConversationActionTypes, ConversationAdd, ConversationAddSuccess, ConversationQuery, } from './conversation.actions';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Injectable()
export class ConversationEffects {

  constructor(private readonly afs: AngularFirestore,
              private readonly auth: AuthenticationService,
              private actions$: Actions,
              private conversationDispatcher: ChatDispatcherService) {}

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
}
