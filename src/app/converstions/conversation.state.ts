import { EntityState } from '@ngrx/entity';

import { Conversation } from './coversation';

export interface ConversationState extends EntityState<Conversation> {
  loading: boolean;
}
