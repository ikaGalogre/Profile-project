import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IAlertData } from '../../models/interfaces/alert-data.interface';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() alertData?: IAlertData;
  showAlert = true;

  hideAlert(event: MouseEvent): void {
    event.preventDefault();
    this.showAlert = false;
  }
}
