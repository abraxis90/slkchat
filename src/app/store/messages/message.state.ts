import { EntityState } from '@ngrx/entity';

import { Message } from './message';

export interface MessageState extends EntityState<Message> {
  loading: boolean;
}
