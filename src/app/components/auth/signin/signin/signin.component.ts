import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../service/users.service';
import { NotificationService } from '../../../../service/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  authService = inject(AuthService);
  userService = inject(UsersService);
  fb = inject(FormBuilder);
  router = inject(Router);
  notificationService = inject(NotificationService);
  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  email = this.signInForm.get('email');
  password = this.signInForm.get('password');

  public showPassword: boolean = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    const { email, password } = this.signInForm.value;
    if (!this.signInForm.valid || !email || !password) {
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.login(email, password);
      this.notificationService.success('Te-ai autentificat cu succes');
      this.router.navigate(['']);
    } catch (error: any) {
      this.notificationService.error('Adresa sau parola nu este corecta');
    } finally {
      this.notificationService.hideLoading();
    }
  }

  async forgotPassword() {
    const { email } = this.signInForm.value;
    if (!email) {
      this.notificationService.error('Introdu adresa ta de email');
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.passwordReset(email);
      this.notificationService.success(
        'Link-ul pentru resetarea parolei a fost trimis'
      );
    } catch (error: any) {
      this.notificationService.error('Adresa nu a fost gasita');
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
