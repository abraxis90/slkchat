import { Component, Input, OnInit } from '@angular/core';
import { empty, Observable } from 'rxjs';

import { AuthenticationService } from '../../../services/auth/authentication.service';
import { flatMap, map } from 'rxjs/operators';
import { Conversation } from '../../../store/converstions/conversation';
import { ChatDispatcherService } from '../../../services/chat-dispatcher/chat-dispatcher.service';
import { Store } from '@ngrx/store';
import { selectConversationByUid } from '../../../store/converstions/conversation.selector';
import { FirebaseUser } from '../../../store/users/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() currentUser: FirebaseUser;
  public currentConversation$: Observable<Conversation>;

  constructor(private auth: AuthenticationService,
              private chatDispatcher: ChatDispatcherService,
              private store: Store<Conversation>) {}

  ngOnInit(): void {
    this.currentConversation$ = empty();
  }

  logout(): void {
    this.auth.logout();
  }

}
