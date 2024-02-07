import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';

import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { combineLatest, map, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from '../product/product.components';
import { AdministratorComponent } from '../administrator/administrator.component';
import { NotificationService } from '../../service/notification.service';
import { ProductsService } from '../../service/products.service';
import { UsersService } from '../../service/users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    ProductComponent,
    AdministratorComponent,
    MatGridListModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class HomeComponent {
  products: any = [];
  favorites: any;
  userService = inject(UsersService);
  currentUser = this.userService.currentUserProfile;
  notificationService = inject(NotificationService);
  productsService = inject(ProductsService);
searchQuery: any;

  ngOnInit(): void {
    combineLatest([
      this.productsService.products$,
      this.userService.currentUserProfile$,
    ])
      .pipe(
        map(([products, userProfile]: any) => {
          this.products = products;
          const uid = userProfile ? userProfile.uid : null;
          const favorite = uid
            ? JSON.parse(localStorage.getItem('favorites-' + uid) || '{}')
            : {};

          this.favorites = favorite;
        })
      )
      .subscribe();
  }

  toggleFavorites(product: any) {
    const uid = this.userService.currentUserProfile().uid;
    this.favorites[product.id] = !this.favorites[product.id];
    localStorage.setItem('favorites-' + uid, JSON.stringify(this.favorites));
  }

  isFavorites(product: any) {
    return this.favorites[product.id];
  }

  async addToCart(prod: any) {
    const isNotInStock = prod?.stock === 0;
    if (isNotInStock) {
      this.notificationService.error('Cantitatea nu este in stoc');
      return;
    }

    const itemToCart = {
      ...prod,
      quantity: 1,
    };

    const newStock = prod.stock - 1;
    try {
      this.notificationService.showLoading();
      await this.productsService.updateProduct({
        ...prod,
        stock: newStock,
      });

      const userProfile = this.userService.currentUserProfile();

      if (!userProfile.cart) {
        userProfile.cart = {
          cartItems: [],
        };
      }

      const exisitingCartItems = userProfile.cart.cartItems.find(
        (items: any) => items.id === itemToCart.id
      );

      if (exisitingCartItems) {
        exisitingCartItems.quantity += itemToCart.quantity;
      } else {
        userProfile.cart.cartItems.push(itemToCart);
      }
      await this.userService.updateUser(userProfile);

      this.notificationService.success('Produsul a fost adaugat cu succes');
    } catch (error: any) {
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
