import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatExpansionModule, ContactModalComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  panelOpenState = false;
  dialog = inject(MatDialog);
  openModal() {
    this.dialog.open(ContactModalComponent);
  }
}
