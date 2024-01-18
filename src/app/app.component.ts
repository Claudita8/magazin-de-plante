import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './service/auth.service';
import { UsersService } from './service/users.service';
import { NotificationService } from './service/notification.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AdministratorComponent,
    HomeComponent,
    RouterModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  userService = inject(UsersService);
  currentUser = this.userService.currentUserProfile;
  notificationService = inject(NotificationService);
  loading = this.notificationService.loading;
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
