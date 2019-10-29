import { Component, Input, OnInit } from '@angular/core';
import { User } from 'firebase';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../../services/auth/authentication.service';
import { flatMap, map } from 'rxjs/operators';
import { Conversation } from '../../../store/converstions/conversation';
import { ChatDispatcherService } from '../../../services/chat-dispatcher/chat-dispatcher.service';
import { Store } from '@ngrx/store';
import { selectConversationByUid } from '../../../store/converstions/conversation.selector';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() currentUser: User;
  public currentConversation$: Observable<Conversation>;

  constructor(private auth: AuthenticationService,
              private chatDispatcher: ChatDispatcherService,
              private store: Store<Conversation>) {}

  ngOnInit(): void {
    this.currentConversation$ = this.chatDispatcher.currentConversationUid$
      .pipe(
        flatMap(conversationUid => {
          return this.store.select(selectConversationByUid(), conversationUid);
        })
      );
  }

  logout(): void {
    this.auth.logout();
  }

}
