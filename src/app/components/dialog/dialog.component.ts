import { Component, inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogResult } from '../../models/enums/dialog-result.enum';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  @Input() dialogData?: any;
  private dialogRef = inject(MatDialogRef<DialogComponent>);

  public onCancelClick(): void {
    this.dialogRef.close(DialogResult.Cancel);
  }

  public onUpdateCkick(): void {
    this.dialogRef.close(DialogResult.Update);
  }
}
