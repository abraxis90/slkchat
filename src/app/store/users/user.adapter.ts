import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { User } from './user';

export const userAdapter: EntityAdapter<User> =
  createEntityAdapter<User>({
    selectId: (user: User) => user.uid
  });
