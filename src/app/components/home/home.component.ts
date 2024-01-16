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
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from '../product/product.components';
import { AdministratorComponent } from '../administrator/administrator.component';

class ProductInfo {
  name: string = '';
  price: number = 0;
  description: string = '';
  ghidDeIngrijire: string = '';
}

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
  ],
})
export class HomeComponent {
  data: any = signal([]);
  firestore: Firestore = inject(Firestore);
  // storage = inject(Storage);
  // productInfo = { name: '', price: 0, description: '', ghidDeIngrijire: '' };
  // selectedFile: any;

  // onFileChange(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

  // async submit(form: any, id: any) {
  //   const filePath = 'productImages/' + id;
  //   const storageRef = ref(this.storage, filePath);
  //   await uploadBytes(storageRef, this.selectedFile);
  //   const image = await getDownloadURL(storageRef);
  //   const productsCollection = collection(this.firestore, 'products');
  //   const product = { ...form.value, id, image };
  //   console.log(product, id);
  //   await addDoc(productsCollection, product);

  //   this.productInfo = new ProductInfo();
  //   this.selectedFile = null;
  // }

  constructor() {
    const productsCollection = collection(this.firestore, 'products'); /// select products
    collectionData(productsCollection).subscribe((product: any) => {
      const sortData = product.sort((a: any, b: any) => {
        return a.id - b.id;
      });
      this.data.set(sortData);
      console.log(product);
    });
  }
}
