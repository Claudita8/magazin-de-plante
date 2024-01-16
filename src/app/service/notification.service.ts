import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  loading = signal(false);
  showLoading() {
    this.loading.set(true);
  }
  hideLoading() {
    this.loading.set(false);
  }
  snackBar = inject(MatSnackBar);
  success(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  error(message: string) {
    this.snackBar.open(message, 'Close', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
