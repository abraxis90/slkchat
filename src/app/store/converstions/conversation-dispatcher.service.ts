import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

import { Subscription } from 'rxjs';

import { Conversation, CONVERSATIONS_PATH, MESSAGES_PATH } from './conversation';
import { map } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';
import { ConversationLoadSuccess } from './conversation.actions';
import { Message } from './message';

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


  constructor(private readonly afs: AngularFirestore, private store: Store<{ conversations: Conversation[] }>) {
    this.conversationCollection = this.afs.collection<FirebaseConversation>(CONVERSATIONS_PATH);

    this.conversationUpsertedSubscription = this.conversationCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((conversationChangeActions: DocumentChangeAction<FirebaseConversation>[]) => {
          return conversationChangeActions.map((changeAction: DocumentChangeAction<FirebaseConversation>) => {
            const conversationChangeActionData = changeAction.payload.doc.data();
            const conversationUsers = conversationChangeActionData.users.map(userUid => {
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
    const createdConversation = this.makeDocumentConversation(conversation);
    return this.conversationCollection.add(createdConversation);
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

  private makeDocumentConversation(conversation: Conversation): FirebaseConversation {
    return { users: conversation.users.map(user => user.uid) };
  }

}
