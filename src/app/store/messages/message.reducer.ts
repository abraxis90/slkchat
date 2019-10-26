import { MessageAdapter } from './message.adapter';
import { MessageActions, MessageActionTypes } from './message.actions';
import { MessageState } from './message.state';


const initialState = MessageAdapter.getInitialState({
  loading: false
});

export function messageReducer(state = initialState,
                               action: MessageActions): MessageState {
  switch (action.type) {
    case MessageActionTypes.MessagesLoad:
      return { ...state, loading: true };

    case MessageActionTypes.MessagesLoadSuccess:
      return MessageAdapter.addMany(action.payload, initialState);

    case MessageActionTypes.MessageUpsertsLoad:
      return state;

    case MessageActionTypes.MessageAdd:
      return state;

    case MessageActionTypes.MessageAddSuccess:
      return MessageAdapter.addMany(action.payload, state);

    default:
      return state;
  }
}
