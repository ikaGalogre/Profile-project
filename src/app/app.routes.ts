import { Routes } from '@angular/router';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { EditComponent } from './components/edit/edit.component';

export const routes: Routes = [
  { path: '', component: UserInfoComponent },
  { path: 'edit/:id', component: EditComponent },
];
