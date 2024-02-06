import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { UsersService } from '../../service/users.service';
import { ProductsService } from '../../service/products.service';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
})
export class ProductComponent implements OnInit {
  @Input()
  product!: any;

  products: any = [];
  favorites: any;
  userService = inject(UsersService);
  currentUser = this.userService.currentUserProfile;
  notificationService = inject(NotificationService);
  productsService = inject(ProductsService);

  constructor() {}
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
    const uid = this.userService.currentUserProfile().uid
    this.favorites[product.id] = !this.favorites[product.id];
    localStorage.setItem('favorites-'+uid, JSON.stringify(this.favorites));
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
