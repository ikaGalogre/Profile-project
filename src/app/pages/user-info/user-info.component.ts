import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDefaultUserInfo, IUserInfo } from '../../models/interfaces';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services/alert-service/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { defaultData, succesAlertData, userData } from '../../mock-data/mock';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [AlertComponent, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  user: IUserInfo[] = [];
  showSuccessAlert = false;
  alertData = succesAlertData;
  userData: IUserInfo = userData;
  defaultData: IDefaultUserInfo = defaultData;
  destroy$ = new Subject<null>();

  private userService = inject(UserService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userService
      .getUserData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.user = data;
      });
    this.alertService.success$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        this.showSuccessAlert = success;

        if (success) {
          setTimeout(() => {
            this.alertService.resetSuccess();
          }, 3000);
        }
      });
  }

  navigateToEdit(user: IUserInfo) {
    this.router.navigate([`/edit/${user.id || 1}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
