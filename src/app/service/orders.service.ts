import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  firestore = inject(Firestore);
  ordersCollection$ = collection(this.firestore, 'orders');
  orders$ = collectionData(this.ordersCollection$);
  orders = toSignal(this.orders$);
}
