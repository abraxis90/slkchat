import { EntityState } from '@ngrx/entity';

import { Conversation } from './conversation';

export interface ConversationState extends EntityState<Conversation> {
  loading: boolean;
}
