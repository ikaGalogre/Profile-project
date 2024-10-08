import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, USER_FEATURE_KEY } from './user.reducer';

export const selectUserState =
  createFeatureSelector<UserState>(USER_FEATURE_KEY);

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

export const selectLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);
export const selectSuccess = createSelector(
  selectUserState,
  (state: UserState) => state.success
);
