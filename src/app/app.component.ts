import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from './services/auth/authentication.service';
import { ChatDispatcherService } from './services/chat-dispatcher/chat-dispatcher.service';
import { FirebaseUser } from './store/users/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public currentUser: Observable<FirebaseUser | null>;

  constructor(private auth: AuthenticationService,
              private router: Router,
              private matIconRegistry: MatIconRegistry,
              private chatDispatcher: ChatDispatcherService,
              private domSanitizer: DomSanitizer) {

    // INIT
    this.currentUser = auth.state.pipe(
      tap(user => {
        if (user !== null) {
          // let the dispatcher decide whether a subscription needs to be made
          this.chatDispatcher.prepareListenToConversationUpserts();
        }
      })
    );

    this.matIconRegistry.addSvgIcon(
      `google_logo`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/google_logo.svg')
    );
  }

}
