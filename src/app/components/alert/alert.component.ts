import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IAlertData } from '../../models/interfaces';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() alertData?: IAlertData;
  showAlert = true;

  hideAlert(event: MouseEvent): void {
    event.preventDefault();
    this.showAlert = false;
  }
}
