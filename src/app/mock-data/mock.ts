import { IAlertData } from '../models/interfaces/alert-data.interface';
import { IDefaultUserInfo } from '../models/interfaces/default-info.interface';
import { IDialogData } from '../models/interfaces/dialog-data.interface';

export const defaultData: IDefaultUserInfo = {
  defaultInfoText:
    'It looks like your profile is incomplete! Press "Add Profile Info" to add your profile picture, name, mobile number, and email.',
  defaultPicture:
    'https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
};

export const dialogData: IDialogData = {
  header: 'Edit Profile',
  title: "By continuing, you'll edit profile information",
  cancel: 'Cancel',
  update: 'Update',
};

export const errorAlertData: IAlertData = {
  alertText: 'Something went wrong, try again later!',
  matIconName: 'info',
};

export const succesAlertData: IAlertData = {
  alertText: 'Your profile has been successfully updated!',
  matIconName: 'info',
};
