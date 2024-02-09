import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'final-order',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Comanda Informatii</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="'yes'" [routerLink]="'/'">
        Da
      </button>
    </div>
  `,
  imports: [MatButtonModule, MatDialogModule, RouterModule],
})
export class FinalOrderModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FinalOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
