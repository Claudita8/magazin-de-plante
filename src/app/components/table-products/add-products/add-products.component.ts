import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { addDoc } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../service/products.service';
import { NotificationService } from '../../../service/notification.service';
import { productCategory } from '../../../constants';
import { FileUploadComponent } from '../file-upload/file-upload.component';
@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    FileUploadComponent,
  ],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss',
})
export class AddProductsComponent {
  category = productCategory;

  fb = inject(FormBuilder);
  storage = inject(Storage);
  productsService = inject(ProductsService);
  notifications = inject(NotificationService);

  productsForm = this.fb.group({
    name: [''],
    category: [''],
    price: [''],
    stock: [''],
    description: [''],
    ghidDeIngrijire: [''],
    image: [null],
  });

  async submit(id: number) {
    if (this.productsForm.invalid) {
      return;
    }
    try {
      this.notifications.showLoading();
      const filePath = 'productImages/' + id;
      const storageRef = ref(this.storage, filePath);
      const image = this.productsForm.value.image || new Blob();
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      const product = {
        ...this.productsForm.value,
        id: id,
        image: url,
      };
      await addDoc(this.productsService.productsCollection$, product);
      this.notifications.success('Ai adaugat un produs cu succes');
    } catch (error: any) {
      this.notifications.error('Ai o eroare');
    } finally {
      this.notifications.hideLoading();
    }
    this.productsForm.reset();
  }
}
