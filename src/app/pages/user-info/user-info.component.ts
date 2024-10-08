import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../components/alert/alert.component';
import { Observable, Subject } from 'rxjs';
import { defaultData, succesAlertData } from '../../mock-data/mock';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IDefaultUserInfo } from '../../models/interfaces/default-info.interface';
import { IUserInfo } from '../../models/interfaces/user-info.interface';
import { UserState } from '../../stores/user-store/user.reducer';
import { Store } from '@ngrx/store';
import { selectUser } from '../../stores/user-store/user.selectors';
import { UserActions } from '../../stores/user-store/user.actions';
import { IAlertData } from '../../models/interfaces/alert-data.interface';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [AlertComponent, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent implements OnInit {
  alertData: IAlertData = succesAlertData;
  defaultData: IDefaultUserInfo = defaultData;

  user$: Observable<IUserInfo | null>;

  private router = inject(Router);
  private store: Store<UserState> = inject(Store);

  constructor() {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUser({}));
  }

  navigateToEdit(user: IUserInfo) {
    this.router.navigate([`/edit/${user.id}`]);
  }
}
