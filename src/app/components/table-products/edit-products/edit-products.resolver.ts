import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ProductsService } from '../../../service/products.service';
import { map } from 'rxjs';

export const editProductResolver = (route: ActivatedRouteSnapshot) => {
  const productService = inject(ProductsService);
  const productId = route.paramMap.get('id');
  return productService.products$.pipe(
    map((products) => {
      const product = products.find(
        (product) => String(product['id']) === productId
      );
      return product;
    })
  );
};
