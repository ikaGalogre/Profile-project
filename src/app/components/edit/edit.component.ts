import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { IUserInfo } from '../../models/interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  userForm: FormGroup;
  userData: IUserInfo = {
    id: 0,
    name: '',
    surname: '',
    mobile: '',
    email: '',
    profilePicture: '',
  };
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
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
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedImageUrl = reader.result as string;

        const updatedUser = {
          ...this.userData,
          profilePicture: uploadedImageUrl,
        };

        this.http
          .patch(`http://localhost:3000/users/${this.userData.id}`, updatedUser)
          .subscribe({
            next: () => {
              this.router.navigate(['']);
            },
            error: (error) => {
              console.error('Error updating profile', error);
            },
          });
      };

      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this.userService.updateUserData(this.userData).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  cancel() {
    this.router.navigate(['']);
  }
}
