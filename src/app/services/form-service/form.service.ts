import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IUserInfo } from '../../models/interfaces';
import { mapFormToUserInfo } from '../../utilities/mappers/user-maper';
import { AlertService } from '../alert-service/alert.service';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user-service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  prePopulateUserForm(
    userForm: FormGroup,
    id: number,
    destroy$: Subject<null>,
    setPreviewUrl: (url: string | null) => void
  ): void {
    this.userService
      .editUserData(id)
      .pipe(takeUntil(destroy$))

      .subscribe((userData: IUserInfo) => {
        userForm.patchValue({
          id: userData.id,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          mobile: userData.mobile,
          profilePicture: userData.profilePicture,
        });

        setPreviewUrl(userData.profilePicture);
      });
  }

  submitUserForm(
    form: FormGroup,
    userData: IUserInfo,
    id: number,
    destroy$: Subject<any>,
    setLoading: (loading: boolean) => void,
    showError: (showError: boolean) => void
  ): void {
    if (form.valid) {
      setLoading(true);
      const updatedUser: IUserInfo = mapFormToUserInfo(userData, form, id);

      this.userService
        .updateUserData(updatedUser)
        .pipe(takeUntil(destroy$))
        .subscribe({
          next: () => {
            setLoading(false);
            this.alertService.showSuccess();
            this.router.navigate(['']);
          },
          error: () => {
            setLoading(false);
            showError(true);
          },
        });
    }
  }
}
