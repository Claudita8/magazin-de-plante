import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  firestore = inject(Firestore);
  storage = inject(Storage);
  productsCollection$ = collection(this.firestore, 'products');
  products$ = collectionData(this.productsCollection$);
  products = toSignal(this.products$);

  async updateProduct(product: any): Promise<any> {
    const productSnapshot = await getDocs(this.productsCollection$);
    productSnapshot.docs.forEach((docSnapshot: any) => {
      if (docSnapshot.data()['id'] === product.id) {
        const ref = doc(this.firestore, 'products', docSnapshot.id);
        return updateDoc(ref, { ...product });
      }
      return;
    });
  }
  async deleteProduct(product: any): Promise<any> {
    const productSnapshot = await getDocs(this.productsCollection$);
    productSnapshot.docs.forEach((docSnapshot: any) => {
      if (docSnapshot.data()['id'] === product.id) {
        const ref = doc(this.firestore, 'products', docSnapshot.id);
        return deleteDoc(ref);
      }
      return;
    });
  }
}
