import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { IUserInfo } from '../../models/interfaces/user-info.interface';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load User': props<{ id?: number }>(),
    'Load User Success': props<{ user: IUserInfo }>(),
    'Load User Failure': props<{ error: any }>(),

    'Update User': props<{ user: IUserInfo }>(),
    'Update User Success': props<{ user: IUserInfo }>(),
    'Update User Failure': props<{ error: any }>(),
  },
});
