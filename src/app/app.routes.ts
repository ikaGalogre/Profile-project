import { Routes } from '@angular/router';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { EditComponent } from './pages/edit/edit.component';

export const routes: Routes = [
  { path: '', component: UserInfoComponent },
  { path: 'edit/:id', component: EditComponent },
];
