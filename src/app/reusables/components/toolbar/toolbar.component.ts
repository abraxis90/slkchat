import { Component, Input } from '@angular/core';
import { User } from 'firebase';

import { AuthenticationService } from '../../../services/auth/authentication.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() currentUser: User;

  constructor(private auth: AuthenticationService) {}

  logout(): void {
    this.auth.logout();
  }
}
