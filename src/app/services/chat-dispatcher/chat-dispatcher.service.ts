import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/internal/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DateTime } from 'luxon';

import { Conversation, CONVERSATIONS_PATH, FirebaseConversation } from '../../store/converstions/conversation';
import { ConversationLoad } from '../../store/converstions/conversation.actions';
import { FirebaseMessage, Message, MESSAGES_PATH } from '../../store/messages/message';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../../store/users/user';
import { selectAllUsers } from '../../store/users/user.selector';

const START_OF_TODAY = DateTime.local().startOf('day');
const MESSAGES_SENT_AT_FILTERS = [
  START_OF_TODAY.toJSDate(),
  START_OF_TODAY.plus({ days: 3 }).toJSDate(),
  DateTime.local().minus({ weeks: 1 }).startOf('week').toJSDate(),
  DateTime.local().minus({ months: 1 }).startOf('month').toJSDate(),
  DateTime.local().startOf('year').toJSDate(),
  DateTime.fromMillis(0).toJSDate()
];

@Injectable({
  providedIn: 'root'
})
export class ChatDispatcherService {

  private conversationCollection: AngularFirestoreCollection<FirebaseConversation>;
  private upsertedConversations$: Observable<Conversation[]>;
  private users$: Observable<User[]> = this.store.select(selectAllUsers);
  private currentMessagesCollection: AngularFirestoreCollection<FirebaseMessage>;
  private currentConversationDateQueryGenerator: IterableIterator<Date>;

  public closeCurrentMessages$: Subject<boolean> = new Subject<boolean>();
  public messageFromOtherUser$: Subject<boolean> = new Subject<boolean>();

  public currentConversationUid$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  public currentConversationDateQuery$: BehaviorSubject<Date> = new BehaviorSubject<Date>(MESSAGES_SENT_AT_FILTERS[0]);

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
      ref => ref.where('userUids', 'array-contains', this.auth.state.value.uid)
    );

    return this.conversationCollection.snapshotChanges(['added', 'modified'])
      .pipe(
        map((conversationChangeActions) => {
          return conversationChangeActions.map((changeAction: DocumentChangeAction<FirebaseConversation>) => {
            const conversationChangeActionData = changeAction.payload.doc.data();
            return new Conversation(changeAction.payload.doc.id, conversationChangeActionData.userUids, []);
          });
        })
      );
  }

  createConversation(conversation: FirebaseConversation): Promise<DocumentReference> {
    const firebaseConversation = {
      userUids: conversation.userUids
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
    // set currentMessageCollection
    this.currentMessagesCollection = this.afs.collection<FirebaseMessage>(`${CONVERSATIONS_PATH}/${conversationUid}/${MESSAGES_PATH}`);

    // broadcast currentConversationUid
    if (this.currentConversationUid$) {
      this.currentConversationUid$.next(conversationUid);
    }

    return this.currentConversationDateQuery$.pipe(
      switchMap((dateQuery: Date) => {
        return this.afs.collection<FirebaseMessage>(
          `${CONVERSATIONS_PATH}/${conversationUid}/${MESSAGES_PATH}`,
          ref => {
            return ref.where('sentAt', '>=', dateQuery).orderBy('sentAt');
          }
        ).snapshotChanges(['added'])
          .pipe(
            tap((messageChangeActions: DocumentChangeAction<FirebaseMessage>[]) => {
              // keep increasing time frame as long as there are no messages to show
              if (messageChangeActions.length < 1) {
                const generatedQuery = this.currentConversationDateQueryGenerator.next();
                if (generatedQuery.value) {
                  this.currentConversationDateQuery$.next(generatedQuery.value);
                }
              }
            }),
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
      }),
      takeUntil(this.closeCurrentMessages$)
    );
  }

  sendMessageToCurrentConversation(firebaseMessage: FirebaseMessage): Promise<Message> {
    if (!this.currentMessagesCollection && !this.currentMessagesCollection) {
      return Promise.reject();
    } else {
      return this.currentMessagesCollection.add(firebaseMessage)
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
    this.closeCurrentMessages$.next(true);
    this.currentConversationUid$.next(undefined);
    this.currentConversationDateQuery$.next(MESSAGES_SENT_AT_FILTERS[0]);
  }

  private initCurrentMessages(): void {
    this.currentConversationDateQueryGenerator = this.generateDateQuery();
    this.currentMessagesCollection = undefined;
  }

  private* generateDateQuery() {
    // as the behavior subject starts from the first value, start from the second instead
    let idx = 1;
    while (idx < MESSAGES_SENT_AT_FILTERS.length - 1) {
      yield MESSAGES_SENT_AT_FILTERS[idx++];
    }
    if (idx >= MESSAGES_SENT_AT_FILTERS.length - 1) {
      return MESSAGES_SENT_AT_FILTERS[idx];
    }
  }

  /* endregion */

}
