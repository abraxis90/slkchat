import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ConversationState } from './conversation.state';
import { ConversationAdapter } from './conversation.adapter';

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

export const selectConversationByUid = () =>
  createSelector(
    selectConversationEntities,
    (conversations, uid) => conversations[uid]
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

/**
 * Will return all the current messages belonging to a given conversation.
 */
export const selectConversationMessages = () =>
  createSelector(
    selectConversationEntities,
    (conversationEntities, conversationUid) => conversationEntities[conversationUid] ?
      conversationEntities[conversationUid].messages : []
  );

/**
 * Will return all the currently loaded old messages belonging to a given conversation.
 * Note a message is considered old if it's not in the scope of the currently queried conversation messages.
 */
export const selectOldConversationMessages = () =>
  createSelector(
    selectConversationEntities,
    (conversationEntities, conversationUid) => conversationEntities[conversationUid] ?
      conversationEntities[conversationUid].oldMessages : []
  );

/**
 * Will return the uid of the first message ever sent in the respective conversation
 */
export const selectConversationFirstMessageUid = () =>
  createSelector(
    selectConversationEntities,
    (conversationEntities, conversationUid) => conversationEntities[conversationUid] ?
      conversationEntities[conversationUid].firstMessageUid : ''
  );

/**
 * Will return a currently opened conversation. If none available, will return undefined.
 */
export const selectOpenedConversation = () =>
  createSelector(
    selectAllConversations,
    (conversations) => {
      return conversations.filter(conversation => conversation.opened)[0] || undefined;
    }
  );
