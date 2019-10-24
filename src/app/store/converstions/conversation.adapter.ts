import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Conversation } from './conversation';

export const ConversationAdapter: EntityAdapter<Conversation> =
  createEntityAdapter<Conversation>({
    selectId: (conversation: Conversation) => conversation.uid
  });
