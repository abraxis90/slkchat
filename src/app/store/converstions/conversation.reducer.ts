import { ConversationAdapter } from './conversation.adapter';
import { ConversationActions, ConversationActionTypes } from './conversation.actions';
import { ConversationState } from './conversation.state';

const initialState = ConversationAdapter.getInitialState({
  loading: false
});

export function conversationReducer(state = initialState,
                                    action: ConversationActions): ConversationState {
  switch (action.type) {
    case ConversationActionTypes.ConversationLoad:
      return { ...state, loading: true };

    case ConversationActionTypes.ConversationLoadSuccess:
      return ConversationAdapter.addMany(action.payload, initialState);

    case ConversationActionTypes.ConversationAdd:
      return state;

    case ConversationActionTypes.ConversationAddSuccess:
      return ConversationAdapter.addOne(action.payload, state);

    case ConversationActionTypes.ConversationMessageSend:
      return state;

    case  ConversationActionTypes.ConversationMessageSendSuccess:
      return ConversationAdapter.upsertOne(action.payload, state);

    default:
      return state;
  }
}
