import { EntityState } from '@ngrx/entity';

import { User } from './user';

export interface UserState extends EntityState<User> {
}
