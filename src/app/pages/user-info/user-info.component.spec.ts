import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserInfoComponent } from './user-info.component';
import { Store } from '@ngrx/store';
import { UserActions } from '../../stores/user-store/user.actions';
import { provideHttpClient } from '@angular/common/http';
import { IUserInfo } from '../../models/interfaces/user-info.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const mockUser: IUserInfo = {
      id: 1,
      name: 'John',
      email: 'john.doe@example.com',
      surname: 'doe',
      mobile: '',
      profilePicture: '',
    };
    storeSpy.select.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [
        UserInfoComponent,
        CommonModule,
        MatIconModule,
        MatButtonModule,
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUser action on ngOnInit', () => {
    component.ngOnInit();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      UserActions.loadUser({ id: 1 })
    );
  });

  it('should navigate to edit page with user id', () => {
    const user: IUserInfo = {
      id: 1,
      name: 'John',
      email: 'john.doe@example.com',
      surname: 'doe',
      mobile: '',
      profilePicture: '',
    };
    component.navigateToEdit(user);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit/1']);
  });
});
