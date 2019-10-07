import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class IsAuthenticatedGuardService implements CanActivate {

  constructor(public auth: AuthenticationService) {
  }

  async canActivate(): Promise<boolean> {
    return await this.auth.isLoggedIn();
  }
}
