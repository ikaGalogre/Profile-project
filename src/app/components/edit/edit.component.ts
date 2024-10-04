import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { IAlertData, IDialogData, IUserInfo } from '../../models/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogResult } from '../../models/enums';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { dialogData, errorAlertData, userData } from '../../mock-data/mock';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { emailRegExp } from '../../utilities/regular-expresions/regular-expresions';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
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
  userData: IUserInfo = userData;
  dialogData: IDialogData = dialogData;
  alertData: IAlertData = errorAlertData;
  destroy$ = new Subject<null>();

  constructor(
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
      email: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.pattern(emailRegExp),
        ],
      ],
      mobile: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      profilePicture: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((param) => {
      let id = Number(param.get('id'));
      this.getById(id);
    });
  }

  getById(id: number) {
    this.userService
      .editUserData(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.userData = data;
        this.userForm.get('name')?.setValue(this.userData.name);
        this.userForm.get('surname')?.setValue(this.userData.surname);
        this.userForm.get('email')?.setValue(this.userData.email);
        this.userForm.get('mobile')?.setValue(this.userData.mobile);
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
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const updatedUser: IUserInfo = {
        ...this.userData,
        profilePicture: this.selectedFile
          ? (this.previewUrl as string)
          : (this.userData.profilePicture as string),
        name: this.userForm.get('name')?.value as string,
        surname: this.userForm.get('surname')?.value as string,
        email: this.userForm.get('email')?.value as string,
        mobile: this.userForm.get('mobile')?.value as string,
      };

      this.userService
        .updateUserData(updatedUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            setTimeout(() => {
              this.loading = false;
              this.alertService.showSuccess();
              this.router.navigate(['']);
            }, 2000);
          },
          error: () => {
            setTimeout(() => {
              this.loading = false;
              this.showErrorAlert = true;
            }, 2000);
          },
        });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
    });

    dialogRef.componentInstance.dialogData = this.dialogData;

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: DialogResult) => {
        if (result === DialogResult.Update) {
          this.onSubmit();
        }
      });
  }

  cancel() {
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
