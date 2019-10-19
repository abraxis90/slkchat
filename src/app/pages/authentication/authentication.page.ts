import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPageComponent {

  loginInProgreess: Boolean = false;

  constructor(private auth: AuthenticationService) {}

  login(): void {
    this.loginInProgreess = true;
    this.auth.login()
      .then(() => {
        this.loginInProgreess = false;
      });
  }
}
