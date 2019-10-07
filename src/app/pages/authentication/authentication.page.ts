import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss']
})
export class AuthenticationPageComponent {

  constructor(private auth: AuthenticationService) {}

  login(): void {
    this.auth.login();
  }
}
