import { OnInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductsService } from '../../service/products.service';
import { NotificationService } from '../../service/notification.service';
import { MatIconModule } from '@angular/material/icon';

import { MatGridListModule } from '@angular/material/grid-list';

import { MatDialog } from '@angular/material/dialog';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DeleteProductsComponent } from './delete-products/delete-products.component';

@Component({
  selector: 'table-products',
  styleUrls: ['./table-products.component.scss'],
  templateUrl: 'table-products.component.html',
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TableProductsComponent implements OnInit {
  productService = inject(ProductsService);
  notification = inject(NotificationService);
  dialog = inject(MatDialog);
  columnsToDisplay: string[] = ['name', 'price', 'stock', 'category'];
  columnNames: any = {
    name: 'Denumire Produs',
    price: 'Pret',
    stock: 'Stoc',
    category: 'Categorie',
  };

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  dataSource!: MatTableDataSource<any>;
  expandedElement: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}
  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async deleteProduct(product: any) {
    const dialogRef = this.dialog.open(DeleteProductsComponent, {
      data: {
        message: 'Esti sigur ca vrei sa stergi produsul?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        try {
          this.notification.showLoading();
          this.productService.deleteProduct(product);
          this.notification.success('Produsul a fost sters cu succes!');
        } catch (error: any) {
          this.notification.error(error.message);
        } finally {
          this.notification.hideLoading();
        }
      }
    });
  }
}
