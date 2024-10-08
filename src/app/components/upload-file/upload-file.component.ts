import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { defaultData } from '../../mock-data/mock';
import { IDefaultUserInfo } from '../../models/interfaces/default-info.interface';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true,
    },
  ],
  templateUrl: './upload-file.component.html',
})
export class UploadFileComponent implements ControlValueAccessor, OnChanges {
  @Input() previewUrl: string | null = null;
  @ViewChild('imageFileInput') fileInput!: ElementRef<HTMLInputElement>;
  defaultData: IDefaultUserInfo = defaultData;
  selectedFile: File | null = null;

  profileImg = signal(defaultData.defaultPicture);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['previewUrl']) {
      this.profileImg.set(
        this.previewUrl ? this.previewUrl : defaultData.defaultPicture
      );
    }
  }

  onChange: (file: string | null) => void = () => {};
  onTouched: () => void = () => {};

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;

        this.onChange(this.previewUrl);
        this.profileImg.set(this.previewUrl);
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
      this.onChange(null);
      this.profileImg.set(defaultData.defaultPicture);
    }
  }

  fileRemoved() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.onChange(null);
    this.profileImg.set(defaultData.defaultPicture);
  }

  writeValue(file: string | null): void {
    this.selectedFile = null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
