import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private successSubject = new BehaviorSubject<boolean>(false);

  success$ = this.successSubject.asObservable();

  showSuccess(): void {
    this.successSubject.next(true);
  }

  resetSuccess(): void {
    this.successSubject.next(false);
  }
}
