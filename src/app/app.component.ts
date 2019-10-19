import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from './services/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public currentUser: Observable<User | null>;

  constructor(private auth: AuthenticationService,
              private router: Router,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {

    // INIT
    this.currentUser = auth.state.pipe(
      tap(user => {
        // redirect to appropriate routes
        if (user !== null) {
          this.router.navigate(['conversations']);
        } else {
          this.router.navigate(['login']);
        }
      })
    );

    this.matIconRegistry.addSvgIcon(
      `google_logo`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/google_logo.svg')
    );
  }

}
