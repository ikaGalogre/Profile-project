import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DialogResult } from '../../models/enums/dialog-result.enum';
import { AlertComponent } from '../../components/alert/alert.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { dialogData, errorAlertData, userData } from '../../mock-data/mock';
import { Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { emailRegExp } from '../../utilities/regular-expresions/regular-expresions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { FormService } from '../../services/form-service/form.service';
import { IAlertData } from '../../models/interfaces/alert-data.interface';
import { IDialogData } from '../../models/interfaces/dialog-data.interface';
import { IUserInfo } from '../../models/interfaces/user-info.interface';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  userForm: FormGroup;
  showErrorAlert = false;
  loading = false;
  id = 0;
  userData: IUserInfo = userData;
  dialogData: IDialogData = dialogData;
  alertData: IAlertData = errorAlertData;
  destroy$ = new Subject<null>();

  private formService = inject(FormService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
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
      this.id = Number(param.get('id'));
      this.getById(this.id);
    });
  }

  getById(id: number) {
    this.formService.prePopulateUserForm(
      this.userForm,
      id,
      this.destroy$,
      (url: string | null) => {
        this.previewUrl = url;
        this.cdr.markForCheck();
      }
    );
  }

  onSubmit(): void {
    this.formService.submitUserForm(
      this.userForm,
      this.userData,
      this.id,
      this.destroy$,
      (loading: boolean) => {
        this.loading = loading;
        this.cdr.markForCheck();
      },
      (showError: boolean) => {
        this.showErrorAlert = showError;
        this.cdr.markForCheck();
      }
    );
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
          this.cdr.markForCheck();
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
