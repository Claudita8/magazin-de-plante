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
}
