import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MessageState } from './message.state';
import { MessageAdapter } from './message.adapter';

const selectMessageState = createFeatureSelector<MessageState>('message');
const messageEntitySelectors = MessageAdapter.getSelectors();

export const selectAllMessages = createSelector(
  selectMessageState,
  messageEntitySelectors.selectAll
);

export const selectMessagesLoading = createSelector(
  selectMessageState,
  (state: MessageState) => state.loading
);
