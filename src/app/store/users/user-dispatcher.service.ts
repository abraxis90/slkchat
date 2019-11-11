import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { FirebaseUser, User } from './user';
import { filter, map } from 'rxjs/internal/operators';
import { UserLoadSuccess } from './user.actions';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserDispatcherService {

  private userCollection: AngularFirestoreCollection<FirebaseUser>;
  private userSubscription: Subscription;

  constructor(private readonly afs: AngularFirestore,
              private readonly auth: AuthenticationService,
              private readonly store: Store<{ users: User[] }>) {

    this.userCollection = this.afs.collection<FirebaseUser>('USERS');
    this.userSubscription = this.userCollection.snapshotChanges()
      .pipe(
        map((changeActions: DocumentChangeAction<FirebaseUser>[]) => {
          return changeActions.map((changeAction: DocumentChangeAction<FirebaseUser>) => {
            const changeActionData: FirebaseUser = changeAction.payload.doc.data();
            return new User(changeAction.payload.doc.id, changeActionData.email, changeActionData.fullName, changeActionData.avatarURL);
          });
        })
      )
      .subscribe((users: User[]) => {
        // filter out own user
        const filteredUsers = users.filter(user => this.auth.state.value !== null ? user.uid !== this.auth.state.value.uid : false);
        this.store.dispatch(new UserLoadSuccess(filteredUsers));
      });
  }
}
