import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule],
})
export class ProductComponent {
  @Input()
  product!: any;

  favorites: any = {};

  constructor() {
    const favorites = localStorage.getItem('favorites');
    this.favorites = favorites ? JSON.parse(favorites) : {};
  }

  toggleFavorites(product: any) {
    this.favorites[product.id] = !this.favorites[product.id];
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  isFavorites(product: any) {
    return this.favorites[product.id];
  }
}
