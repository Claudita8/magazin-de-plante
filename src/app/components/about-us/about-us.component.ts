import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatExpansionModule, ContactModalComponent, MatButtonModule],
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
