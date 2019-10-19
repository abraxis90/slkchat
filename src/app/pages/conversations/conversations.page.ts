import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';


import { Conversation } from '../../store/converstions/conversation';
import { User } from '../../store/users/user';
import { selectAllConversations } from '../../store/converstions/conversation.selector';
import { selectAllUsers } from '../../store/users/user.selector';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ContactListComponent } from '../../reusables/contact-list/contact-list.component';
import { ConversationAdd } from '../../store/converstions/conversation.actions';
import { ConversationDispatcherService } from '../../store/converstions/conversation-dispatcher.service';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPageComponent {
  private conversations$: Observable<Conversation[]> = this.store.select(selectAllConversations);
  public users$: Observable<User[]> = this.store.select(selectAllUsers);
  public conversationsDrawable$: Observable<Conversation[]> =
    combineLatest(
      this.conversations$,
      this.users$
    ).pipe(
      map(([conversations, users]) => {
        return conversations
          .map((conversation: Conversation) => {
            conversation.users = conversation.users
              .map(user => {
                return this.findUserInList(user.uid, users);
              });
            return conversation;
          });
      })
    );

  constructor(private store: Store<{ users: User[], conversations: Conversation[] }>,
              private dialog: MatDialog,
              private conversationDispatcher: ConversationDispatcherService) {
  }

  createConversation() {
    const dialogRef: MatDialogRef<ContactListComponent> = this.dialog.open(ContactListComponent, {
      data: { users$: this.users$ }
    });
    dialogRef.afterClosed().subscribe((selectedContacts: User[]) => {
      if (selectedContacts !== undefined) {
        const freshConversation = new Conversation(undefined, [], selectedContacts, undefined);
        this.store.dispatch(new ConversationAdd(freshConversation));
      }
    });
  }

  loadMessages(conversationUid: string) {
    this.conversationDispatcher.loadCurrentMessageCollection(conversationUid);
  }

  public trackByUid(index, conversation) {
    return conversation ? conversation.uid : undefined;
  }

  private findUserInList(uid: string, users: User[]): User {
    return users.find(user => user.uid === uid);
  }
}
