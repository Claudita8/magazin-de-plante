import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.components';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, combineLatest, map } from 'rxjs';
import { UsersService } from '../../service/users.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-my-favorites',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './my-favorites.component.html',
  styleUrl: './my-favorites.component.scss',
})
export class MyFavoritesComponent implements OnInit, OnDestroy {
  products: any = [];
  favoriteProducts: any = '';
  router = inject(Router);
  productsService = inject(ProductsService);
  userService = inject(UsersService);

  favorites: any = {};
  notificationService = inject(NotificationService);

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
          this.favoriteProducts = this.products.filter(
            (product: any) => this.favorites[product.id]
          );
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {}

  toggleFavorites(product: any) {
    const uid = this.userService.currentUserProfile().uid;

    this.favorites[product.id] = !this.favorites[product.id];
    localStorage.setItem('favorites-' + uid, JSON.stringify(this.favorites));
    if (!this.favorites[product.id]) {
      this.favoriteProducts = this.favoriteProducts.filter(
        (p: any) => p.id !== product.id
      );
    }
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
