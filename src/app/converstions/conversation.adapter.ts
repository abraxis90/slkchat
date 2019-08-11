import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Conversation } from './coversation';

export const conversationAdapter: EntityAdapter<Conversation> =
  createEntityAdapter<Conversation>({
    selectId: (conversation: Conversation) => conversation.uid,
    sortComparer: sortByPublishedOn
  });

function sortByPublishedOn(a: Conversation, b: Conversation): number {
  return (b.lastSent) - (a.lastSent);
}
