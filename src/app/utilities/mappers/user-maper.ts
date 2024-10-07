import { FormGroup } from '@angular/forms';
import { IUserInfo } from '../../models/interfaces/user-info.interface';

export function mapFormToUserInfo(
  userData: IUserInfo,
  userForm: FormGroup,
  id: number
): IUserInfo {
  return {
    ...userData,
    id: id || userData.id,
    name: userForm.get('name')?.value?.trim() || userData.name,
    surname: userForm.get('surname')?.value?.trim() || userData.surname,
    email: userForm.get('email')?.value?.trim() || userData.email,
    mobile: userForm.get('mobile')?.value?.trim() || userData.mobile,
    profilePicture:
      userForm.get('profilePicture')?.value || userData.profilePicture,
  };
}
