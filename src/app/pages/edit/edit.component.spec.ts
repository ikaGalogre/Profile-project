import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EditComponent } from './edit.component';
import { UserService } from '../../services/user-service/user-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', {
      editUserData: of({
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        mobile: '1234567890',
        profilePicture: null,
      }),
      updateUserData: of({}),
    });

    await TestBed.configureTestingModule({
      imports: [EditComponent, BrowserAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' }),
            queryParams: of({ page: 1 }),
          },
        },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getById function and pre-populate the form with user data', () => {
    component.ngOnInit();
    expect(userServiceSpy.editUserData).toHaveBeenCalledWith(1);
    expect(component.userForm.get('name')?.value).toBe('John');
    expect(component.userForm.get('surname')?.value).toBe('Doe');
    expect(component.userForm.get('email')?.value).toBe('john.doe@example.com');
    expect(component.userForm.get('mobile')?.value).toBe('1234567890');
  });

  it('should handle form submission and call updateUserData', () => {
    component.userForm.get('name')?.setValue('Jane');
    component.userForm.get('surname')?.setValue('Smith');
    component.userForm.get('email')?.setValue('jane.smith@example.com');
    component.userForm.get('mobile')?.setValue('0987654321');
    component.onSubmit();

    expect(userServiceSpy.updateUserData).toHaveBeenCalled();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });
});
