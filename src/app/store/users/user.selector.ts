import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from './user.state';
import { userAdapter } from './user.adapter';

const userSelector = createFeatureSelector<UserState>('user');
const userEntitySelectors = userAdapter.getSelectors();

export const selectAllUsers = createSelector(
  userSelector,
  userEntitySelectors.selectAll
);
