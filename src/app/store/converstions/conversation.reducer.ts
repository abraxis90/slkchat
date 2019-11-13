import { ConversationAdapter } from './conversation.adapter';
import { ConversationActions, ConversationActionTypes } from './conversation.actions';
import { ConversationState } from './conversation.state';

const initialState = ConversationAdapter.getInitialState({
  loading: false
});

export function conversationReducer(state = initialState,
                                    action: ConversationActions): ConversationState {
  switch (action.type) {

    case ConversationActionTypes.ConversationQuery:
      return { ...state, loading: true };

    case ConversationActionTypes.ConversationAdded:
      return ConversationAdapter.addOne({ ...action.payload }, { ...state, loading: false });

    case ConversationActionTypes.ConversationModified:
      return ConversationAdapter.updateOne({
        id: action.payload.uid,
        changes: action.payload
      }, state);

    case ConversationActionTypes.ConversationMessageLoad:
      return ConversationAdapter.updateOne({
        id: action.payload.conversationUid,
        changes: { messagesLoading: true }
      }, state);

    case ConversationActionTypes.ConversationMessageLoadSuccess:
      return ConversationAdapter.updateOne({
        id: action.payload.conversationUid,
        changes: {
          messagesLoading: false,
          ...action.payload.messages
        }
      }, state);

    case ConversationActionTypes.ConversationMessageAdded:
      return ConversationAdapter.updateOne({
        id: action.payload.conversationUid,
        changes: {
          messages: state.entities[action.payload.conversationUid].messages.concat(action.payload),
        }
      }, state);

    default:
      return state;
  }
}
