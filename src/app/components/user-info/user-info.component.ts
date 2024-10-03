import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { IUserInfo } from '../../models/interfaces';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  user: IUserInfo[] = [];
  constructor(private router: Router, private userService: UserService) {}
  ngOnInit(): void {
    this.userService.getUserData().subscribe((data) => {
      this.user = data;
    });
  }

  navigateToEdit(user: IUserInfo) {
    this.router.navigate([`/edit/${user.id}`]);
  }
}
