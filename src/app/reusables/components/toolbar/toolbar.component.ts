import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Conversation, ConversationWithUsers } from '../../../store/converstions/conversation';
import { FirebaseUser, User } from '../../../store/users/user';
import { selectAllUsers } from '../../../store/users/user.selector';
import { selectOpenedConversation } from '../../../store/converstions/conversation.selector';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() currentUser: FirebaseUser;
  private currentConversation$: Observable<Conversation | undefined> = this.store.select(selectOpenedConversation());
  private users$: Observable<User[]> = this.store.select(selectAllUsers).pipe(
    map(users => {
      // filter out own user
      return users.filter(user => user.uid !== this.auth.state.value.uid);
    })
  );
  public conversationsDrawable$: Observable<ConversationWithUsers> =
    combineLatest([
      this.currentConversation$,
      this.users$
    ]).pipe(
      map(([conversation, users]) => {
        if (!conversation) {
          return;
        }

        return {
          ...conversation,
          users: conversation.userUids
            .map(userUid => {
              return users.find(user => user.uid === userUid);
            })
            .filter(user => user !== undefined)
        };
      })
    );

  constructor(private auth: AuthenticationService,
              private store: Store<{ users: User[], conversations: Conversation[] }>) {}

  ngOnInit(): void {}

  logout(): void {
    this.auth.logout();
  }

}
