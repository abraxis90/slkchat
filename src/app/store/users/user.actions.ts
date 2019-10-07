import { Action } from '@ngrx/store';

import { User } from './user';

export enum UserActionTypes {
  UserLoadSuccess = 'user.load.success'
}

export type UserActions = UserLoadSuccess;

/* LOAD */
export class UserLoadSuccess implements Action {
  readonly type = UserActionTypes.UserLoadSuccess;

  constructor(public payload: User[]) {
  }
}
