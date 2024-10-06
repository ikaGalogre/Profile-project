import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IDefaultUserInfo } from '../../models/interfaces';
import { defaultData } from '../../mock-data/mock';

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
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements ControlValueAccessor {
  @Input() previewUrl: string | null = null;
  @ViewChild('imageFileInput') fileInput!: ElementRef<HTMLInputElement>;
  defaultData: IDefaultUserInfo = defaultData;
  selectedFile: File | null = null;

  private cdr = inject(ChangeDetectorRef);

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
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.previewUrl = null;
      this.onChange(null);
      this.cdr.markForCheck();
    }
  }

  fileRemoved() {
    this.previewUrl = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.onChange(null);
    this.cdr.markForCheck();
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
