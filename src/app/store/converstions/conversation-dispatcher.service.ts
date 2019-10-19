import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

import { Subscription } from 'rxjs';

import { Conversation, CONVERSATIONS_PATH, MESSAGES_PATH } from './conversation';
import { map } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';
import { ConversationLoadSuccess } from './conversation.actions';
import { Message } from './message';
import { AuthenticationService } from '../../services/auth/authentication.service';

interface FirebaseConversation {
  users: string[];
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConversationDispatcherService {

  private conversationCollection: AngularFirestoreCollection<FirebaseConversation>;
  private conversationUpsertedSubscription: Subscription;
  private currentMessageCollection: AngularFirestoreCollection<Message>;
  private currentMessageUpsertedSubscription: Subscription;


  constructor(private readonly afs: AngularFirestore,
              private auth: AuthenticationService,
              private store: Store<{ conversations: Conversation[] }>) {

    this.conversationCollection = this.afs.collection<FirebaseConversation>(CONVERSATIONS_PATH);

    this.conversationUpsertedSubscription = this.conversationCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((conversationChangeActions: DocumentChangeAction<FirebaseConversation>[]) => {
          return conversationChangeActions.map((changeAction: DocumentChangeAction<FirebaseConversation>) => {
            const conversationChangeActionData = changeAction.payload.doc.data();
            const conversationUsers = conversationChangeActionData.users
            // filter out own user from conversation participants
              .filter(userUid => userUid !== this.auth.state.value.uid)
              .map(userUid => {
                return { uid: userUid };
              });
            return new Conversation(changeAction.payload.doc.id, [], conversationUsers, undefined);
          });
        })
      )
      .subscribe((conversations: Conversation[]) => {
        this.store.dispatch(new ConversationLoadSuccess(conversations));
      });
  }

  createConversation(conversation: Conversation): Promise<DocumentReference> {
    const firebaseConversation = {
      users: conversation.users
        .map(user => user.uid)
        .concat(this.auth.state.value.uid)
    };
    return this.conversationCollection.add(firebaseConversation);
  }

  loadCurrentMessageCollection(conversationUid: string) {
    this.currentMessageCollection = this.afs.collection<Message>(`${CONVERSATIONS_PATH}/${conversationUid}/${MESSAGES_PATH}`);
    this.currentMessageUpsertedSubscription = this.currentMessageCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((messageChangeActions: DocumentChangeAction<Message>[]) => {
          return messageChangeActions.map((messageChangeAction: DocumentChangeAction<Message>) => {
            const messageData = messageChangeAction.payload.doc.data();
            return new Message(
              messageChangeAction.payload.doc.id,
              conversationUid,
              messageData.body,
              messageData.from,
              undefined,
              undefined);
          });
        })
      )
      .subscribe((test) => {
        console.log(test);
      });
  }

  dropCurrentMessageCollection() {
    this.currentMessageCollection = undefined;
  }

}
