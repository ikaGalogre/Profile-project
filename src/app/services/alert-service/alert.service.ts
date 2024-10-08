import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private successSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);

  success$: Observable<boolean> = this.successSubject.asObservable();
  error$: Observable<boolean> = this.errorSubject.asObservable();

  showSuccess(): void {
    this.triggerAlert(this.successSubject);
  }

  showError(): void {
    this.triggerAlert(this.errorSubject);
  }

  private triggerAlert(subject: BehaviorSubject<boolean>): void {
    subject.next(true);
    setTimeout(() => {
      this.resetAlert(subject);
    }, 3000);
  }

  private resetAlert(subject: BehaviorSubject<boolean>): void {
    subject.next(false);
  }
}
