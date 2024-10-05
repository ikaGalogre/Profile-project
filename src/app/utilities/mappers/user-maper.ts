import { FormGroup } from '@angular/forms';
import { IUserInfo } from '../../models/interfaces';

export function mapFormToUserInfo(
  userData: IUserInfo,
  userForm: FormGroup
): IUserInfo {
  return {
    ...userData,
    name: userForm.get('name')?.value?.trim() || userData.name,
    surname: userForm.get('surname')?.value?.trim() || userData.surname,
    email: userForm.get('email')?.value?.trim() || userData.email,
    mobile: userForm.get('mobile')?.value?.trim() || userData.mobile,
    profilePicture:
      userForm.get('profilePicture')?.value || userData.profilePicture,
  };
}
