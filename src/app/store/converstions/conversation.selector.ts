import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ConversationState } from './conversation.state';
import { ConversationAdapter } from './conversation.adapter';
import { Conversation } from './conversation';

const selectConversationState = createFeatureSelector<ConversationState>('conversation');
const conversationEntitySelectors = ConversationAdapter.getSelectors();

export const selectAllConversations = createSelector(
  selectConversationState,
  conversationEntitySelectors.selectAll
);

export const selectConversationEntities = createSelector(
  selectConversationState,
  ConversationAdapter.getSelectors().selectEntities
);

export const selectConversationIds = createSelector(
  selectConversationState,
  ConversationAdapter.getSelectors().selectIds
);

export const selectConversationByUid = () => createSelector(
  selectAllConversations,
  (conversations: Conversation[], uid) => {
    return conversations.filter(conversation => conversation.uid === uid)[0];
  }
);

/**
 * Will return a conversation matching the provided Uids. Otherwise will return an empty array.
 */
export const selectConversationsByUserUids = () =>
  createSelector(
    selectAllConversations,
    (conversations, userUids) => {
      return conversations.filter(conversation => {
        const conversationUserUids = conversation.users.map(user => user.uid);
        return JSON.stringify(conversationUserUids) === JSON.stringify(userUids);
      });
    }
  );

export const selectConversationMessages = () =>
  createSelector(
    selectConversationEntities,
    (conversationEntities, conversationUid) => conversationEntities[conversationUid] ?
      conversationEntities[conversationUid].messages : []
  );

export const selectOldConversationMessages = () =>
  createSelector(
    selectConversationEntities,
    (conversationEntities, conversationUid) => conversationEntities[conversationUid] ?
      conversationEntities[conversationUid].oldMessages : []
  );

export const selectConversationFirstMessageUid = () =>
  createSelector(
    selectConversationEntities,
    (conversationEntities, conversationUid) => conversationEntities[conversationUid] ?
      conversationEntities[conversationUid].firstMessageUid : ''
  );
