import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPageComponent {

  loginInProgress: Boolean = false;

  constructor(public auth: AuthenticationService) {}

  login(): void {
    this.loginInProgress = true;
    this.auth.login()
      .then(() => {
        this.loginInProgress = false;
      });
  }
}
