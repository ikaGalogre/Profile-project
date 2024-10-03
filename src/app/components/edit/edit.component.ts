import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { IUserInfo } from '../../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogResult } from '../../models/enums';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  userForm: FormGroup;
  showErrorAlert = false;
  loading = false;
  userData: IUserInfo = {
    id: 0,
    name: '',
    surname: '',
    mobile: '',
    email: '',
    profilePicture: '',
  };
  dialogData = {
    header: 'Edit Profile',
    title: "By continuing, you'll edit profile information",
    cancel: 'Cancel',
    update: 'Update',
  };
  alertData = {
    alertText: 'Something went wrong, try again later',
    matIconName: 'info',
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      mobile: ['', [Validators.pattern('^[0-9]*$')]],
      profilePicture: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      let id = Number(param.get('id'));
      this.getById(id);
    });
  }

  getById(id: number) {
    this.userService.editUserData(id).subscribe((data) => {
      this.userData = data;
      // Set values in the form controls using setValue
      this.userForm.get('name')?.setValue(this.userData.name);
      this.userForm.get('surname')?.setValue(this.userData.surname);
      this.userForm.get('email')?.setValue(this.userData.email);
      this.userForm.get('mobile')?.setValue(this.userData.mobile);
      // Set preview URL from profile picture if available
      this.previewUrl = this.userData.profilePicture;
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // Reset if no file is selected
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Use form value directly
      this.loading = true;
      const updatedUser = {
        ...this.userData,
        profilePicture: this.selectedFile
          ? this.previewUrl
          : this.userData.profilePicture,
        name: this.userForm.get('name')?.value,
        surname: this.userForm.get('surname')?.value,
        email: this.userForm.get('email')?.value,
        mobile: this.userForm.get('mobile')?.value,
      };

      this.http
        .patch(`http://localhost:3000/users/${this.userData.id}`, updatedUser)
        .subscribe({
          next: () => {
            setTimeout(() => {
              this.loading = false;
              this.alertService.showSuccess();
              this.router.navigate(['']);
            }, 2000);
          },
          error: (error) => {
            setTimeout(() => {
              this.loading = false;
              this.showErrorAlert = true;
            }, 2000);
          },
        });
    }
  }

  cancel() {
    this.router.navigate(['']);
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
    });

    dialogRef.componentInstance.dialogData = this.dialogData;

    dialogRef.afterClosed().subscribe((result: DialogResult) => {
      if (result === DialogResult.Update) {
        this.onSubmit();
      }
    });
  }
}
