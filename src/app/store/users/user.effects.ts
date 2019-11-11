import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { UserActionTypes, UserQuery } from './user.actions';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirebaseUser } from './user';
import { CONVERSATIONS_PATH, FirebaseConversation } from '../converstions/conversation';

@Injectable()
export class UserEffects {

  private userCollection: AngularFirestoreCollection<FirebaseUser>;

  constructor(private actions$: Actions,
              private readonly afs: AngularFirestore) {
    this.userCollection = this.afs.collection<FirebaseUser>('USERS');
  }


  @Effect()
  query$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.UserQuery as string),
    switchMap((action: UserQuery) => {
      return this.userCollection.stateChanges();
    }),
    mergeMap(actions => actions),
    map(action => {
      return {
        type: `user.${action.type}`,
        payload: { uid: action.payload.doc.id, ...action.payload.doc.data() }
      };
    })
  );

}
