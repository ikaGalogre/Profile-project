import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IAlertData } from '../../models/interfaces/alert-data.interface';
import { AlertService } from '../../services/alert-service/alert.service';
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() alertData?: IAlertData;

  private alertService = inject(AlertService);

  success$ = this.alertService.success$;
  error$ = this.alertService.error$;
}
