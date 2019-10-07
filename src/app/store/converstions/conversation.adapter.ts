import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Conversation } from './conversation';

export const ConversationAdapter: EntityAdapter<Conversation> =
  createEntityAdapter<Conversation>({
    selectId: (conversation: Conversation) => conversation.uid,
    sortComparer: sortByPublishedOn
  });

function sortByPublishedOn(a: Conversation, b: Conversation): number {
  return (b.lastSent) - (a.lastSent);
}
