import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../service/products.service';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.components';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-favorites',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './my-favorites.component.html',
  styleUrl: './my-favorites.component.scss',
})
export class MyFavoritesComponent implements OnInit {
  products: any = [];
  favoriteProducts: any = '';
  router = inject(Router);
  productsService = inject(ProductsService);

  favorites: any = {};

  constructor() {
    const favorites = localStorage.getItem('favorites');
    this.favorites = favorites ? JSON.parse(favorites) : {};
  }
  ngOnInit(): void {
    this.productsService.products$.subscribe((products) => {
      this.products = products;
      this.favoriteProducts = this.products.filter(
        (p: any) => this.favorites[p.id]
      );
    });
  }

  toggleFavorites(product: any) {
    this.favorites[product.id] = !this.favorites[product.id];
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
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
