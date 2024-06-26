import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../service/products.service';
import { UsersService } from '../../service/users.service';
import { NotificationService } from '../../service/notification.service';
import { ActivatedRoute } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackServiceService } from '../../service/feedback-service.service';
import { map } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteFeedbacksComponent } from './delete-feedback.component';
import { StockMessage } from '../../pipes/stock-message.pipe';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    DeleteFeedbacksComponent,
    StockMessage,
  ],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss',
})
export class ProductInfoComponent implements OnInit {
  editProduct = signal<any>({});
  feedbackInfo = signal<any>([]);
  productsService = inject(ProductsService);
  feedbackService = inject(FeedbackServiceService);
  userService = inject(UsersService);
  currentUser = this.userService.currentUserProfile;
  notificationService = inject(NotificationService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);

  getColor(stockMessage: string): string {
    switch (stockMessage) {
      case 'Stoc epuizat':
        return 'red';
      case 'Ultimele produse':
        return 'orange';
      case 'Stoc limitat':
        return '#FFBF00';
      case 'In stoc':
        return 'green';
      default:
        return 'black';
    }
  }

  quantityForm = this.fb.group({
    quantity: [1, Validators.required],
  });

  productInfoForm = this.fb.group({
    userFeedback: ['', Validators.required],
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.productsService.products$.subscribe((products) => {
        const product = products.find((p: any) => p.id === Number(id));

        this.editProduct.set(product);
      });
    });

    this.feedbackService.firestoreCollection
      .pipe(
        map((feedback) => {
          return feedback.filter(
            (feedback: any) => feedback.id === this.editProduct().id
          );
        })
      )
      .subscribe((feedback) => {
        this.feedbackInfo.set(feedback);
      });
  }

  async submit() {
    if (this.productInfoForm.invalid) {
      return;
    }

    try {
      this.notificationService.showLoading();
      await this.feedbackService.updateRecenzie({
        id: this.editProduct().id,
        feedback: [
          {
            user: {
              ...this.userService.currentUserProfile(),
            },
            feedback: this.productInfoForm.value.userFeedback,
            date: new Date().toLocaleString(),
            id: this.editProduct().id,
          },
        ],
      });
      this.notificationService.success('Recenzia a fost adaugata cu succes');
    } catch (error: any) {
      this.notificationService.error('Recenzia nu s-a putut adauga');
    } finally {
      this.notificationService.hideLoading();
    }
  }

  async addToCart() {
    const isNotInStock = this.quantityForm.value.quantity
      ? this.quantityForm?.value?.quantity > this.editProduct()?.stock
      : false;
    if (this.quantityForm.invalid || isNotInStock) {
      this.notificationService.error('Cantitatea nu este in stoc');
      return;
    }

    const itemToCart = {
      ...this.editProduct(),
      quantity: this.quantityForm.value.quantity,
    };

    const newStock = this.editProduct().stock - itemToCart.quantity;
    try {
      this.notificationService.showLoading();
      await this.productsService.updateProduct({
        ...this.editProduct(),
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
  async deleteComment(recenzie: any) {
    const dialogRef = this.dialog.open(DeleteFeedbacksComponent, {
      data: {
        message: 'Esti sigur ca vrei sa stergi comentariul?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        try {
          this.notificationService.showLoading();
          this.feedbackService.removeComment(recenzie);
          this.notificationService.success(
            'Comentariul a fost sters cu succes!'
          );
        } catch (error: any) {
          this.notificationService.error('Comentariul nu s -a putut sterge!');
        } finally {
          this.notificationService.hideLoading();
        }
      }
    });
  }
}
