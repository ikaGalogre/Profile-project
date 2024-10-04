import { IAlertData, IDialogData, IUserInfo } from '../models/interfaces';

export const userData: IUserInfo = {
  id: 0,
  name: '',
  surname: '',
  mobile: '',
  email: '',
  profilePicture: '',
};
export const dialogData: IDialogData = {
  header: 'Edit Profile',
  title: "By continuing, you'll edit profile information",
  cancel: 'Cancel',
  update: 'Update',
};
export const errorAlertData: IAlertData = {
  alertText: 'Something went wrong, try again later',
  matIconName: 'info',
};
export const succesAlertData: IAlertData = {
  alertText: 'Profile editted succesfully',
  matIconName: 'info',
};
