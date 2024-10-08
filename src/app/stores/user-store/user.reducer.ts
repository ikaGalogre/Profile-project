import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { IUserInfo } from '../../models/interfaces/user-info.interface';

export const USER_FEATURE_KEY = 'user';

export interface UserState {
  user: IUserInfo | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUser, (state) => {
    return { ...state };
  }),
  on(UserActions.loadUserSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      error: null,
    };
  }),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(UserActions.updateUser, (state) => {
    return { ...state, loading: true };
  }),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    success: true,
    loading: false,
    user,
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    success: false,
    loading: false,
    error,
  }))
);
