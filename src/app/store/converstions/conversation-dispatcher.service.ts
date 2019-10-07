import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';

import { Subscription } from 'rxjs';

import { Conversation } from './conversation';
import { map } from 'rxjs/internal/operators';
import { Store } from '@ngrx/store';
import { ConversationLoadSuccess } from './conversation.actions';

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


  constructor(private readonly afs: AngularFirestore, private store: Store<{ conversations: Conversation[] }>) {
    this.conversationCollection = this.afs.collection<FirebaseConversation>('CONVERSATIONS');

    this.conversationUpsertedSubscription = this.conversationCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((changeActions: DocumentChangeAction<FirebaseConversation>[]) => {
          return changeActions.map((changeAction: DocumentChangeAction<FirebaseConversation>) => {
            const changeActionData = changeAction.payload.doc.data();
            const conversationUsers = changeActionData.users.map(userUid => {
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

  private makeDocumentConversation(conversation: Conversation): FirebaseConversation {
    return { users: conversation.users.map(user => user.uid) };
  }

}
