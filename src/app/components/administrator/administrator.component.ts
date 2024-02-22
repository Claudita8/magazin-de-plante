import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TableProductsComponent } from '../table-products/table-products.component';
import { TableOrdersComponent } from '../table-orders/table-orders.component';
import { TableUsersComponent } from '../table-users/table-users.component';
import { TableContactComponent } from '../table-contact/table-contact.component';

@Component({
  selector: 'administrator',
  styleUrls: ['./administrator.component.scss'],
  templateUrl: './administrator.component.html',
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    TableProductsComponent,
    TableOrdersComponent,
    TableUsersComponent,
    TableContactComponent,
  ],
})
export class AdministratorComponent {}
