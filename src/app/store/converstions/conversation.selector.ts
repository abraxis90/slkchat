import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ConversationState } from './conversation.state';
import { conversationAdapter } from './conversation.adapter';

const conversationSelector = createFeatureSelector<ConversationState>('conversation');
const conversationEntitySelectors = conversationAdapter.getSelectors();

export const selectAllConversations = createSelector(
  conversationSelector,
  conversationEntitySelectors.selectAll
);
