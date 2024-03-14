import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { FinalOrderModalComponent } from './final-order-modal.component';
import { UsersService } from '../../service/users.service';
import { NotificationService } from '../../service/notification.service';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FinalOrderModalComponent,
    MatDividerModule,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  userService = inject(UsersService);
  notificationService = inject(NotificationService);
  dialog = inject(MatDialog);
  firestore = inject(Firestore);
  fb = inject(FormBuilder);

  stepForm = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
  });

  currentUser = this.userService.currentUserProfile();
  user = signal<any>({
    ...this.currentUser,
  });

  constructor() {
    this.userService.currentUserProfile$.subscribe((user) => {
      this.user.set(user);
    });
    effect(() => {
      this.stepForm.patchValue({
        name: this.user()?.firstName,
        lastName: this.user()?.lastName,
        address: this.user()?.address,
        email: this.user()?.email,
        phoneNumber: this.user()?.phoneNumber,
      });
    });
  }

  getTotalPrice() {
    const cartTotal = this.user()?.cart?.cartItems.reduce(
      (acc: any, item: any) => {
        return acc + item.quantity * item.price;
      },
      0
    );

    const deliveryPrice = 26.9;
    const totalPrice = cartTotal + deliveryPrice;
    return totalPrice;
  }

  async finalizeTransaction() {
    if (this.stepForm.invalid) {
      this.notificationService.error('Completeaza toate field-urile!');
      return;
    }
    const orderData = {
      ...this.stepForm.value,
      cartItems: this.user().cart.cartItems,
      date: new Date().toLocaleDateString(),
      totalPrice: this.getTotalPrice(),
      deliveryPrice: 26.9,
    };

    try {
      this.notificationService.showLoading();
      await addDoc(collection(this.firestore, 'orders'), orderData);

      this.userService.updateUser({
        ...this.user(),
        cart: { cartItems: [] },
      });
      this.notificationService.success('Comanda a fost realizata cu succes');
      this.dialog.open(FinalOrderModalComponent, {
        data: {
          message: `Comanda in valoare de ${this.getTotalPrice().toFixed(
            2
          )} RON este in curs de procesare.`,
        },
      });
    } catch (error: any) {
      this.notificationService.error(
        'S-a produs o problema.Puteti sa ne contactati'
      );
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
