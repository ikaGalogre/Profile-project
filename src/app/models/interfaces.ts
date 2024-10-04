export interface IUserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
  mobile: string;
  profilePicture: string;
}
export interface IDialogData {
  header: string;
  title: string;
  cancel: string;
  update: string;
}

export interface IAlertData {
  alertText: string;
  matIconName: string;
}
