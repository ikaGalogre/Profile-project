import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogResult } from '../../models/enums';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  @Input() dialogData?: any;
  constructor(public dialogRef: MatDialogRef<DialogComponent>) {}

  public onCancelClick(): void {
    this.dialogRef.close(DialogResult.Cancel);
  }

  public onUpdateCkick(): void {
    this.dialogRef.close(DialogResult.Update);
  }
}
