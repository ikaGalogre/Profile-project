import { FormGroup } from '@angular/forms';
import { IUserInfo } from '../../models/interfaces';

export function mapFormToUserInfo(
  userData: IUserInfo,
  userForm: FormGroup,
  selectedFile: File | null,
  previewUrl: string | null
): IUserInfo {
  return {
    ...userData,
    profilePicture: selectedFile
      ? (previewUrl as string)
      : (userData.profilePicture as string),
    name: userForm.get('name')?.value?.trim() || userData.name,
    surname: userForm.get('surname')?.value?.trim() || userData.surname,
    email: userForm.get('email')?.value?.trim() || userData.email,
    mobile: userForm.get('mobile')?.value?.trim() || userData.mobile,
  };
}
