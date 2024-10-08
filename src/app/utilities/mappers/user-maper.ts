import { FormGroup } from '@angular/forms';
import { IUserInfo } from '../../models/interfaces/user-info.interface';

export function mapFormToUserInfo(userForm: FormGroup, id: number): IUserInfo {
  return {
    id: id,
    name: userForm.get('name')?.value?.trim(),
    surname: userForm.get('surname')?.value?.trim(),
    email: userForm.get('email')?.value?.trim(),
    mobile: userForm.get('mobile')?.value?.trim(),
    profilePicture: userForm.get('profilePicture')?.value,
  };
}
