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
  notificationService = inject(NotificationService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

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
      this.notificationService.error(error.message);
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
