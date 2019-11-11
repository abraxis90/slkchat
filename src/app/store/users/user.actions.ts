import { Action } from '@ngrx/store';

import { User } from './user';

export enum UserActionTypes {
  UserQuery = 'user.query',
  UserAdded = 'user.added',
  UserModified = 'user.modified',
  UserRemoved = 'user.removed'
}

export type UserActions =
  UserQuery
  | UserAdded
  | UserModified
  | UserRemoved;

/* QUERY */
export class UserQuery implements Action {
  readonly type = UserActionTypes.UserQuery;
}

/* ADDED */
export class UserAdded implements Action {
  readonly type = UserActionTypes.UserAdded;

  constructor(public payload: User) {}
}

/* MODIFIED */
export class UserModified implements Action {
  readonly type = UserActionTypes.UserModified;

  constructor(public payload: User) {}
}

/* REMOVED */
export class UserRemoved implements Action {
  readonly type = UserActionTypes.UserRemoved;

  constructor(public payload: User) {}
}
