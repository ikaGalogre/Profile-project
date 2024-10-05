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
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogResult } from '../../models/enums';
import { AlertComponent } from '../../components/alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { dialogData, errorAlertData, userData } from '../../mock-data/mock';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { emailRegExp } from '../../utilities/regular-expresions/regular-expresions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { mapFormToUserInfo } from '../../utilities/mappers/user-maper';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';

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
    MatFormFieldModule,
    MatInputModule,
    UploadFileComponent,
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
      profilePicture: [null],
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

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const updatedUser: IUserInfo = mapFormToUserInfo(
        this.userData,
        this.userForm
      );

      this.userService
        .updateUserData(updatedUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loading = false;
            this.alertService.showSuccess();
            this.router.navigate(['']);
          },
          error: () => {
            this.loading = false;
            this.showErrorAlert = true;
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
