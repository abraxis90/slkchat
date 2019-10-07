import { userAdapter } from './user.adapter';
import { UserActions, UserActionTypes } from './user.actions';
import { UserState } from './user.state';

const initialState = userAdapter.getInitialState({});

export function userReducer(state = initialState,
                            action: UserActions): UserState {
  switch (action.type) {

    case UserActionTypes.UserLoadSuccess:
      return userAdapter.addMany(action.payload, initialState);

    default:
      return state;
  }
}
