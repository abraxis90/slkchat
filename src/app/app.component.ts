import { Component } from '@angular/core';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { AuthenticationService } from './services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public currentUser: Observable<User | null>;

  constructor(private auth: AuthenticationService, private router: Router) {
    this.currentUser = auth.state.pipe(
      tap(user => {
        // redirect to appropriate routes as a side-effect
        if (user !== null) {
          this.router.navigate(['conversations']);
        } else {
          this.router.navigate(['login']);
        }
      })
    );
  }

  logout(): void {
    this.auth.logout();
  }
}
