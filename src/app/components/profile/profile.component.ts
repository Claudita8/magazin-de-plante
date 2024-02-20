import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { addDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { UsersService } from '../../service/users.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  fb = inject(FormBuilder);
  storage = inject(Storage);
  notifications = inject(NotificationService);
  userService = inject(UsersService);

  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  profileForm = this.fb.group({
    uid: [''],
    firstName: [''],
    lastName: [''],
    displayName: [''],
    phoneNumber: [''],
    address: [''],
  });
  constructor() {
    effect(() => {
      this.profileForm.patchValue({ ...this.userService.currentUserProfile() });
    });
  }

  async submit() {
    const { uid, ...data } = this.profileForm.value;
    if (!uid) {
      return;
    }
    if (this.profileForm.invalid) {
      return;
    }
    try {
      this.notifications.showLoading();
      await this.userService.updateUser({ uid, ...data });
      this.notifications.success(
        'Profilul utilizatorului a fost editat cu succes'
      );
    } catch (error: any) {
      this.notifications.error('Ai o eroare');
    } finally {
      this.notifications.hideLoading();
    }
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];
    const currentUserId = this.userService.currentUserProfile()?.uid;
    if (!file || !currentUserId) {
      return;
    }
    try {
      this.notifications.showLoading();

      const photoURL = await this.userService.uploadProfilePhoto(
        file,
        'images/profile/' + currentUserId
      );
      await this.userService.updateUser({ uid: currentUserId, photoURL });
      this.notifications.success(
        'Imaginea utilizatorului a fost modificata cu succes!'
      );
    } catch (error: any) {
      this.notifications.error(
        'Imaginea utilizatorului nu a putut fi modificata!'
      );
    } finally {
      this.notifications.hideLoading();
    }
  }

  async forgotPassword() {
    const { email } = this.userService.currentUserProfile() ?? {};
    if (!email) {
      this.notifications.error('Introdu adresa ta de email');
      return;
    }
    try {
      this.notifications.showLoading();
      await this.authService.passwordReset(email);
      this.notifications.success(
        'Link-ul pentru resetarea parolei a fost trimis!'
      );
    } catch (error: any) {
      this.notifications.error(
        'Link-ul pentru resetarea parolei nu a putut fi trimis!'
      );
    } finally {
      this.notifications.hideLoading();
    }
  }
}
