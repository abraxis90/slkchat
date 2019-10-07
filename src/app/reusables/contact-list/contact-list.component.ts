import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

import { User } from '../../store/users/user';

interface ContactListData {
  users$: Observable<User[]>;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  public users$: Observable<User[]>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ContactListData) {
    this.users$ = this.data.users$;
  }

  selectUser(user: User) {
    console.log(user);
  }

}
