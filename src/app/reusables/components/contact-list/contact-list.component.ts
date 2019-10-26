import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { User } from '../../../store/users/user';

interface ContactListData {
  users$: Observable<User[]>;
}

// TODO support group creation
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  public users$: Observable<User[]>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ContactListData,
              public dialogRef: MatDialogRef<ContactListComponent>) {

    this.users$ = this.data.users$;
  }

  selectUsers(users: User[]) {
    this.dialogRef.close(users);
  }

}
