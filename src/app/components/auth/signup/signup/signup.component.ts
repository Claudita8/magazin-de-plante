import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../../../service/users.service';
import { NotificationService } from '../../../../service/notification.service';

export function passwordMatch(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordMisMatch: true,
      };
    }
    return null;
  };
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  authService = inject(AuthService);
  userService = inject(UsersService);
  fb = inject(FormBuilder);
  router = inject(Router);
  notificationService = inject(NotificationService);

  signUpForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordMatch(),
    }
  );
  name = this.signUpForm.get('name');
  email = this.signUpForm.get('email');
  password = this.signUpForm.get('password');
  confirmPassword = this.signUpForm.get('confirmPassword');

  public showPassword: boolean = false;

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    const { name, email, password } = this.signUpForm.value;
    if (!this.signUpForm.valid || !email || !password) {
      return;
    }
    try {
      this.notificationService.showLoading();
      const {
        user: { uid },
      } = await this.authService.signUp(email, password);
      console.log(uid);
      await this.userService.addUser({ uid, email, displayName: name });
      this.notificationService.success('Ti-ai creat un cont cu succes');
      this.router.navigate(['']);
    } catch (error: any) {
      this.notificationService.error(
        'Adresa este deja folosita sau a aparut o eroare'
      );
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
