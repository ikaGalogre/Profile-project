import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { IUserInfo } from '../../models/interfaces';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  user: IUserInfo[] = [];
  showSuccessAlert = false;
  alertData = {
    alertText: 'Profile editted succesfully',
    matIconName: 'info',
  };
  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.userService.getUserData().subscribe((data) => {
      this.user = data;
    });
    this.alertService.success$.subscribe((success) => {
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
}
