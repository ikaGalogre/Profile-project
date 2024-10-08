import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { UserActions } from './user.actions';
import { UserService } from '../../services/user-service/user-service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert-service/alert.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(({ id = 1 }) =>
        this.userService.editUserData(id).pipe(
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) => of(UserActions.loadUserFailure({ error })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ user }) =>
        this.userService.updateUserData(user).pipe(
          map(() => {
            this.router.navigate(['']);
            this.alertService.showSuccess();
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            this.alertService.showError();
            return of(UserActions.updateUserFailure({ error }));
          })
        )
      )
    )
  );
}
