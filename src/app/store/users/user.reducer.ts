import { userAdapter } from './user.adapter';
import { UserActions, UserActionTypes } from './user.actions';
import { UserState } from './user.state';

const initialState = userAdapter.getInitialState({});

export function userReducer(state = initialState,
                            action: UserActions): UserState {
  switch (action.type) {

    case UserActionTypes.UserAdded:
      return userAdapter.addOne(action.payload, state);

    case UserActionTypes.UserModified:
      return userAdapter.updateOne({
        id: action.payload.uid,
        changes: action.payload
      }, state);

    case UserActionTypes.UserRemoved:
      return userAdapter.removeOne(action.payload.uid, state);

    default:
      return state;
  }
}
