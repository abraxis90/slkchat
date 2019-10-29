import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/internal/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Conversation, CONVERSATIONS_PATH } from '../../store/converstions/conversation';
import { ConversationLoad } from '../../store/converstions/conversation.actions';
import { FirebaseMessage, Message, MESSAGES_PATH } from '../../store/messages/message';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../../store/users/user';
import { selectAllUsers } from '../../store/users/user.selector';
import { selectConversationByUid } from '../../store/converstions/conversation.selector';

interface FirebaseConversation {
  users: string[];
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatDispatcherService {

  private conversationCollection: AngularFirestoreCollection<FirebaseConversation>;
  private upsertedConversations$: Observable<Conversation[]>;
  private currentMessages: {
    conversationUid: string,
    collection: AngularFirestoreCollection<FirebaseMessage>
  };
  public closeCurrentMessages$: Subject<undefined> = new Subject<undefined>();
  public messageFromOtherUser$: Subject<boolean> = new Subject<boolean>();
  public currentConversationUid$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  users$: Observable<User[]> = this.store.select(selectAllUsers);


  constructor(private readonly afs: AngularFirestore,
              private auth: AuthenticationService,
              private store: Store<{ conversations: Conversation[] }>) {
    this.initCurrentMessages();
  }

  /* region CONVERSATIONS */

  prepareListenToConversationUpserts(): void {
    if (this.upsertedConversations$ === undefined) {
      this.store.dispatch(new ConversationLoad());
    }
  }

  listenToConversationUpserts(): Observable<Conversation[]> {
    this.conversationCollection = this.afs.collection<FirebaseConversation>(
      CONVERSATIONS_PATH,
      ref => ref.where('users', 'array-contains', this.auth.state.value.uid)
    );

    this.upsertedConversations$ = this.conversationCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        withLatestFrom(this.users$),
        map(([conversationChangeActions, users]) => {
          return conversationChangeActions.map((changeAction: DocumentChangeAction<FirebaseConversation>) => {
            const conversationChangeActionData = changeAction.payload.doc.data();
            const conversationUsers = conversationChangeActionData.users
            // filter out own user from conversation participants
              .filter(userUid => this.auth.state.value ? userUid !== this.auth.state.value.uid : true)
              .map(userUid => {
                return this.findUserInList(userUid, users);
              });
            return new Conversation(changeAction.payload.doc.id, conversationUsers);
          });
        })
      );

    return this.upsertedConversations$;
  }

  createConversation(conversation: FirebaseConversation): Promise<DocumentReference> {
    const firebaseConversation = {
      users: conversation.users
        .concat(this.auth.state.value.uid)
    };
    return this.conversationCollection.add(firebaseConversation);
  }

  private findUserInList(uid: string, users: User[]): User {
    return users.find(user => user.uid === uid);
  }

  /* endregion */

  /* region MESSAGES */

  loadCurrentMessageCollection(conversationUid: string): Observable<Message[]> {
    const loadedCollection = this.afs.collection<FirebaseMessage>(
      `${CONVERSATIONS_PATH}/${conversationUid}/${MESSAGES_PATH}`,
      ref => ref.orderBy('sentAt')
    );
    return loadedCollection.snapshotChanges(['added', 'modified'])
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
        }),
        tap(() => {
          this.currentConversationUid$.next(conversationUid);
        })
      );
  }

  // TODO: investigate if the limit filter gets a fix
  loadMessageUpserts(conversationUid: string): Observable<Message[]> {
    this.currentMessages.collection = this.afs.collection<FirebaseMessage>(
      `${CONVERSATIONS_PATH}/${conversationUid}/${MESSAGES_PATH}`,
      ref => {
        return ref.orderBy('sentAt');
      }
    );
    this.currentMessages.conversationUid = conversationUid;
    return this.currentMessages.collection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((messageChangeActions: DocumentChangeAction<FirebaseMessage>[]) => {
          const messages = messageChangeActions.map((messageChangeAction: DocumentChangeAction<FirebaseMessage>) => {
            const messageData: FirebaseMessage = messageChangeAction.payload.doc.data();
            return new Message(
              messageChangeAction.payload.doc.id,
              conversationUid,
              messageData.body,
              messageData.from,
              undefined,
              messageData.sentAt);
          });
          return messages;
        })
      );
  }

  sendMessageToCurrentConversation(firebaseMessage: FirebaseMessage): Promise<Message> {
    if (!this.currentMessages && !this.currentMessages.collection) {
      return Promise.reject();
    } else {
      return this.currentMessages.collection.add(firebaseMessage)
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

  dropCurrentMessages(): void {
    this.initCurrentMessages();
    this.closeCurrentMessages$.next(null);
  }

  private initCurrentMessages(): void {
    this.currentMessages = {
      conversationUid: undefined,
      collection: undefined
    };
    this.currentConversationUid$.next(undefined);
  }

  /* endregion */

}
