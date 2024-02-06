import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
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
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ProductsService } from './service/products.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { take } from 'rxjs';

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
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  authService = inject(AuthService);
  router = inject(Router);
  userService = inject(UsersService);
  currentUser = this.userService.currentUserProfile;
  notificationService = inject(NotificationService);
  loading = this.notificationService.loading;
  productService = inject(ProductsService);
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/signin']);
  }

  getCartItems() {
    return this.currentUser()?.cart?.cartItems.reduce((acc: any, item: any) => {
      return acc + item.quantity;
    }, 0);
  }

  getTotalPrice() {
    return this.currentUser()?.cart?.cartItems.reduce((acc: any, item: any) => {
      return acc + item.quantity * item.price;
    }, 0);
  }
  removeItemFromCart(event: any, item: any) {
    event.stopPropagation();

    const cartItems = this.currentUser()?.cart.cartItems.filter(
      (cartItem: any) => cartItem.id !== item.id
    );

    this.userService.updateUser({
      ...this.currentUser(),
      cart: { cartItems },
    });

    this.productService.products$.pipe(take(1)).subscribe((products: any) => {
      const product = products.find((prod: any) => prod.id === item.id);
      const newStock = product.stock + item.quantity;
      this.productService.updateProduct({
        ...product,
        stock: newStock,
      });
    });

    this.trigger.openMenu();
  }

  
}
