import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../service/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AboutUsService } from '../../service/about-us.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.scss',
})
export class ContactModalComponent {
  fb = inject(FormBuilder);
  dialog = inject(MatDialogRef);
  notificationService = inject(NotificationService);
  aboutUsService = inject(AboutUsService);
  contactForm = this.fb.group({
    reason: [''],
    severity: [''],
  });
  async submit(id: number) {
    if (this.contactForm.invalid) {
      return;
    }
    try {
      this.notificationService.showLoading();

      await this.aboutUsService.addContactRequest(
        {
          ...this.contactForm.value,
          date: new Date().toLocaleDateString(),
          isAnswered: false,
        },
        id
      );

      this.notificationService.success('Cererea a fost trimisa cu succes');
    } catch (error: any) {
      this.notificationService.error(error.message);
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
