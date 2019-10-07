import { conversationAdapter } from './conversation.adapter';
import { ConversationActions, ConversationActionTypes } from './conversation.actions';
import { ConversationState } from './conversation.state';

const initialState = conversationAdapter.getInitialState({
  loading: false
});

export function conversationReducer(state = initialState,
                                    action: ConversationActions): ConversationState {
  switch (action.type) {
    case ConversationActionTypes.ConversationLoad:
      return { ...state, loading: true };

    case ConversationActionTypes.ConversationLoadSuccess:
      return conversationAdapter.addMany(action.payload, initialState);

    case ConversationActionTypes.ConversationAdd:
      return state;

    case ConversationActionTypes.ConversationAddSuccess:
      return conversationAdapter.addOne(action.payload, state);

    case ConversationActionTypes.ConversationMessageSend:
      return state;

    case  ConversationActionTypes.ConversationMessageSendSuccess:
      return conversationAdapter.upsertOne(action.payload, state);

    default:
      return state;
  }
}
