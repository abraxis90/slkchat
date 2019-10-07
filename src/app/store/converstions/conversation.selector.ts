import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ConversationState } from './conversation.state';
import { ConversationAdapter } from './conversation.adapter';

const conversationSelector = createFeatureSelector<ConversationState>('conversation');
const conversationEntitySelectors = ConversationAdapter.getSelectors();

export const selectAllConversations = createSelector(
  conversationSelector,
  conversationEntitySelectors.selectAll
);
