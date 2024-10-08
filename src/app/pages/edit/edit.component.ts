import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { emailRegExp } from '../../utilities/regular-expresions/regular-expresions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { IUserInfo } from '../../models/interfaces/user-info.interface';
import {
  selectUser,
  selectLoading,
} from '../../stores/user-store/user.selectors';
import { Store } from '@ngrx/store';
import { UserState } from '../../stores/user-store/user.reducer';
import { UserActions } from '../../stores/user-store/user.actions';
import { dialogData, errorAlertData } from '../../mock-data/mock';
import { IDialogData } from '../../models/interfaces/dialog-data.interface';
import { mapFormToUserInfo } from '../../utilities/mappers/user-maper';
import { IAlertData } from '../../models/interfaces/alert-data.interface';

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
  previewUrl: string | null = null;
  userForm: FormGroup;
  dialogData: IDialogData = dialogData;
  alertData: IAlertData = errorAlertData;
  id!: number;

  user$: Observable<IUserInfo | null>;
  loading$: Observable<boolean>;

  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private store: Store<UserState> = inject(Store);

  constructor() {
    this.user$ = this.store.select(selectUser);
    this.loading$ = this.store.select(selectLoading);

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
      this.store.dispatch(UserActions.loadUser({ id: this.id }));
    });

    this.user$.subscribe((user) => {
      if (user) {
        this.userForm.patchValue(user);
        this.previewUrl = user.profilePicture;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user = mapFormToUserInfo(this.userForm, this.id);
      this.store.dispatch(UserActions.updateUser({ user }));
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
