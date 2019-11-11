import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/internal/operators';


import { Conversation, ConversationWithUsers, FirebaseConversation } from '../../store/converstions/conversation';
import { User } from '../../store/users/user';
import { selectAllConversations, selectConversationsByUserUids } from '../../store/converstions/conversation.selector';
import { selectAllUsers } from '../../store/users/user.selector';
import { ContactListComponent } from '../../reusables/components/contact-list/contact-list.component';
import { ConversationAdd } from '../../store/converstions/conversation.actions';
import { ChatDispatcherService } from '../../services/chat-dispatcher/chat-dispatcher.service';

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPageComponent {
  private conversations$: Observable<Conversation[]> = this.store.select(selectAllConversations);
  public users$: Observable<User[]> = this.store.select(selectAllUsers);
  public conversationsDrawable$: Observable<ConversationWithUsers[]> =
    combineLatest(
      this.conversations$,
      this.users$
    ).pipe(
      map(([conversations, users]) => {
        return conversations
          .map((conversation: Conversation) => {
            if (conversation.userUids && conversation.userUids.length) {
              (conversation as ConversationWithUsers).users = conversation.userUids
                .map(userUid => {
                  return this.findUserInList(userUid, users);
                })
                .filter(user => user !== undefined);
            }
            return conversation as ConversationWithUsers;
          });
      })
    );

  constructor(private store: Store<{ users: User[], conversations: Conversation[] }>,
              private chatDispatcher: ChatDispatcherService,
              private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  createConversation(): void {
    const dialogRef: MatDialogRef<ContactListComponent> = this.dialog.open(ContactListComponent, {
      data: { users$: this.users$ }
    });
    dialogRef.afterClosed()
      .pipe(first())
      .subscribe((selectedContacts: User[]) => {
        if (selectedContacts !== undefined) {
          const selectedContactUids = selectedContacts.map(user => user.uid);
          this.store.select(selectConversationsByUserUids(), selectedContactUids)
            .pipe(first())
            .subscribe(matchingConversations => {
              if (matchingConversations.length) {
                this.navigateToConversationByUid(matchingConversations[0].uid);
              } else {
                // create conversation if it doesn't exist
                const freshConversation = { userUids: selectedContacts.map(user => user.uid) } as FirebaseConversation;
                this.store.dispatch(new ConversationAdd(freshConversation));
              }
            });

        }
      });
  }

  public trackByUid(index, conversation) {
    return conversation ? conversation.uid : undefined;
  }

  private navigateToConversationByUid(conversationUid: string) {
    this.router.navigate([conversationUid], { relativeTo: this.route });
  }

  private findUserInList(uid: string, users: User[]): User {
    return users.find(user => user.uid === uid);
  }
}
