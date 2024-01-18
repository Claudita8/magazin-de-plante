import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Sterge Produs</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Nu</button>
      <button mat-button [mat-dialog-close]="'yes'">Da</button>
    </div>
  `,
  imports: [MatButtonModule, MatDialogModule],
})
export class DeleteProductsComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
