import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponent } from './edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserInfoComponent } from '../user-info/user-info.component';
import { UserActions } from '../../stores/user-store/user.actions';
import {
  selectUser,
  selectLoading,
} from '../../stores/user-store/user.selectors';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let activatedRoute: ActivatedRoute;

  const mockUser = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    mobile: '1234567890',
    profilePicture: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        UploadFileComponent,
        AlertComponent,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        BrowserAnimationsModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectUser,
              value: mockUser,
            },
            {
              selector: selectLoading,
              value: false,
            },
          ],
        }),
        {
          provide: MatDialog,
          useValue: {
            open: jasmine.createSpy('open').and.returnValue({
              afterClosed: () => of(null),
            }),
          },
        },
        provideRouter([
          {
            path: '',
            component: UserInfoComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pre-populate the form with user data', () => {
    fixture.detectChanges();
    expect(component.userForm.value).toEqual({
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      mobile: '1234567890',
      profilePicture: '',
    });
    expect(component.previewUrl).toBe('');
  });

  it('should submit the form when valid', () => {
    spyOn(component['store'], 'dispatch');

    component.id = mockUser.id;
    component.userForm.patchValue(mockUser);

    component.onSubmit();

    expect(component.userForm.valid).toBeTrue();
    expect(component['store'].dispatch).toHaveBeenCalledWith(
      UserActions.updateUser({ user: { ...mockUser, id: component.id } })
    );
  });

  it('should not submit the form when invalid', () => {
    spyOn(component['store'], 'dispatch');

    component.userForm.patchValue({
      name: '',
      surname: '',
      email: '',
      mobile: '',
    });

    component.onSubmit();

    expect(component.userForm.valid).toBeFalse();
    expect(component['store'].dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to the home page on cancel', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
