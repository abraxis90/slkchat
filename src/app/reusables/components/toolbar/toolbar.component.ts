import { Component, Input } from '@angular/core';
import { User } from 'firebase';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../../services/auth/authentication.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() currentUser: User;
  public canNavigateBack$: Observable<boolean> = this.router.events
    .pipe(
      filter(routerEvent => routerEvent instanceof NavigationEnd),
      map((routerEvent: any) => {
        const url = routerEvent.urlAfterRedirects ? routerEvent.urlAfterRedirects : routerEvent.url;
        return url !== '/conversations';
      })
    );

  constructor(private auth: AuthenticationService,
              private router: Router) {}


  logout(): void {
    this.auth.logout();
  }
}
