import {
  Component,
  Input,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../service/products.service';
import { NotificationService } from '../../../service/notification.service';
import { productCategory } from '../../../constants';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { UsersService } from '../../../service/users.service';

@Component({
  selector: 'app-edit-products',
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
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.scss',
})
export class EditProductsComponent implements OnInit {
  editProduct = signal<any>({});
  // @Input()
  // set product(value: any) {
  //   console.log('value', value);
  //   this.editProduct.set(value);
  // }
  category = productCategory;

  fb = inject(FormBuilder);
  storage = inject(Storage);
  notifications = inject(NotificationService);
  userService = inject(UsersService);
  route = inject(ActivatedRoute);
  editProductsForm = this.fb.group({
    id: [''],
    name: [''],
    category: [''],
    price: [''],
    stock: [''],
    description: [''],
    ghidDeIngrijire: [''],
  });

  constructor(private productsService: ProductsService) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.productsService.products$.subscribe((p) => {
        const product = p.find((prod: any) => prod['id'] == id);
        this.editProductsForm.patchValue({ ...product });
        this.editProduct.set(product);
      });
    });
  }

  async submit() {
    if (this.editProductsForm.invalid) {
      return;
    }
    try {
      this.notifications.showLoading();
      await this.productsService.updateProduct(this.editProductsForm.value);
      this.notifications.success('Produsul a fost editat cu succes');
    } catch (error: any) {
      this.notifications.error('Ai o eroare');
    } finally {
      this.notifications.hideLoading();
    }
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];

    if (!file && !this.editProduct()) {
      return;
    }

    try {
      this.notifications.showLoading();
      const photoURL = await this.userService.uploadProfilePhoto(
        file,
        `productImages/${this.editProduct().id}`
      );

      console.log('photoURL', photoURL);
      await this.productsService.updateProduct({
        ...this.editProduct(),
        image: photoURL,
      });
      this.notifications.success(
        'Imaginea produsului a fost modificata cu succes!'
      );
    } catch (error: any) {
      console.log('error', error);
      this.notifications.error('Imaginea produsului nu a putut fi modificata!');
    } finally {
      this.notifications.hideLoading();
    }
  }
}
