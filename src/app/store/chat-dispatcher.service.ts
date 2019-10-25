import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/internal/operators';
import { Observable, Subject } from 'rxjs';

import { Conversation, CONVERSATIONS_PATH } from './converstions/conversation';
import { ConversationLoad } from './converstions/conversation.actions';
import { FirebaseMessage, Message, MESSAGES_PATH } from './messages/message';
import { AuthenticationService } from '../services/auth/authentication.service';

interface FirebaseConversation {
  users: string[];
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatDispatcherService {

  private conversationCollection: AngularFirestoreCollection<FirebaseConversation>;
  private currentMessageCollection: AngularFirestoreCollection<FirebaseMessage>;
  private upsertedConversations$: Observable<Conversation[]>;
  public messageFromOtherUser$: Subject<boolean> = new Subject();


  constructor(private readonly afs: AngularFirestore,
              private auth: AuthenticationService,
              private store: Store<{ conversations: Conversation[] }>) {}

  prepareListenToConversationUpserts(): void {
    if (this.upsertedConversations$ === undefined) {
      this.store.dispatch(new ConversationLoad());
    }
  }

  listenToCoversationUpserts(): Observable<Conversation[]> {
    this.conversationCollection = this.afs.collection<FirebaseConversation>(
      CONVERSATIONS_PATH,
      ref => ref.where('users', 'array-contains', this.auth.state.value.uid)
    );

    this.upsertedConversations$ = this.conversationCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((conversationChangeActions: DocumentChangeAction<FirebaseConversation>[]) => {
          return conversationChangeActions.map((changeAction: DocumentChangeAction<FirebaseConversation>) => {
            const conversationChangeActionData = changeAction.payload.doc.data();
            const conversationUsers = conversationChangeActionData.users
            // filter out own user from conversation participants
              .filter(userUid => this.auth.state.value ? userUid !== this.auth.state.value.uid : true)
              .map(userUid => {
                return { uid: userUid };
              });
            return new Conversation(changeAction.payload.doc.id, conversationUsers, undefined);
          });
        })
      );

    return this.upsertedConversations$;
  }

  createConversation(conversation: Conversation): Promise<DocumentReference> {
    const firebaseConversation = {
      users: conversation.users
        .map(user => user.uid)
        .concat(this.auth.state.value.uid)
    };
    return this.conversationCollection.add(firebaseConversation);
  }

  loadCurrentMessageCollection(conversationUid: string): Observable<Message[]> {
    this.currentMessageCollection = this.afs.collection<FirebaseMessage>(
      `${CONVERSATIONS_PATH}/${conversationUid}/${MESSAGES_PATH}`,
      ref => ref.orderBy('sentAt')
    );
    return this.currentMessageCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((messageChangeActions: DocumentChangeAction<FirebaseMessage>[]) => {
          return messageChangeActions.map((messageChangeAction: DocumentChangeAction<FirebaseMessage>) => {
            const messageData: FirebaseMessage = messageChangeAction.payload.doc.data();
            return new Message(
              messageChangeAction.payload.doc.id,
              conversationUid,
              messageData.body,
              messageData.from,
              undefined,
              messageData.sentAt);
          });
        })
      );
  }

  sendMessageToCurrentConversation(firebaseMessage: FirebaseMessage): Promise<Message> {
    if (!this.currentMessageCollection) {
      return Promise.reject();
    } else {
      return this.currentMessageCollection.add(firebaseMessage)
        .then((docRef: DocumentReference) => {
          return docRef.get()
            .then(messageSnapshot => {
              const messageData = messageSnapshot.data();
              return new Message(
                messageSnapshot.id,
                firebaseMessage.conversationUid,
                messageData.body,
                messageData.from,
                undefined,
                messageData.sentAt
              );
            });
        })
        .catch((reason) => {
          return Promise.reject(reason);
        });
    }
  }

  dropCurrentMessageCollection() {
    this.currentMessageCollection = undefined;
  }

}