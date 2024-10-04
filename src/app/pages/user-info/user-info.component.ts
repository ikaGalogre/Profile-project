import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { IUserInfo } from '../../models/interfaces';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { succesAlertData } from '../../mock-data/mock';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [AlertComponent, CommonModule, MatIconModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  user: IUserInfo[] = [];
  showSuccessAlert = false;
  alertData = succesAlertData;
  destroy$ = new Subject<null>();

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {
    console.log('shakakaka');
  }

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
    this.router.navigate([`/edit/${user.id}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
