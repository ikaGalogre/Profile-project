import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services/alert-service/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { defaultData, succesAlertData, userData } from '../../mock-data/mock';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user-service/user-service';
import { IDefaultUserInfo } from '../../models/interfaces/default-info.interface';
import { IUserInfo } from '../../models/interfaces/user-info.interface';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [AlertComponent, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent implements OnInit, OnDestroy {
  user: IUserInfo[] = [];
  showSuccessAlert = false;
  alertData = succesAlertData;
  userData: IUserInfo = userData;
  defaultData: IDefaultUserInfo = defaultData;
  destroy$ = new Subject<void>();

  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.userService
      .getUserData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.user = [...data];
        this.cdr.markForCheck();
      });

    this.alertService.success$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        this.showSuccessAlert = success;
        this.cdr.markForCheck();

        if (success) {
          setTimeout(() => {
            this.alertService.resetSuccess();
            this.cdr.markForCheck();
          }, 3000);
        }
      });
  }

  navigateToEdit(user: IUserInfo) {
    this.router.navigate([`/edit/${user.id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
