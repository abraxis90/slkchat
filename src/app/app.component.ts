import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from './services/auth/authentication.service';
import { ChatDispatcherService } from './services/chat-dispatcher/chat-dispatcher.service';
import { User } from './store/users/user';
import { UserQuery } from './store/users/user.actions';
import { ConversationMessageQueryAll, ConversationQuery } from './store/converstions/conversation.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public currentUser: Observable<User | null>;

  constructor(private auth: AuthenticationService,
              private router: Router,
              private store: Store<{ users: User[] }>,
              private matIconRegistry: MatIconRegistry,
              private chatDispatcher: ChatDispatcherService,
              private domSanitizer: DomSanitizer) {

    // INIT
    // TODO: maybe make dedicated slice
    this.currentUser = auth.state.pipe(
      tap(user => {
        if (user !== null) {
          this.store.dispatch(new ConversationQuery());
          this.store.dispatch(new UserQuery());
          this.store.dispatch(new ConversationMessageQueryAll());
        }
      })
    );

    this.matIconRegistry.addSvgIcon(
      `google_logo`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/google_logo.svg')
    );
  }

}
