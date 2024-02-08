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
import * as XLSX from 'xlsx';
import { FeedbackServiceService } from '../../service/feedback-service.service';
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
  feedbackService = inject(FeedbackServiceService);
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
          this.feedbackService.deleteFeedback(product);
          this.notification.success('Produsul a fost sters cu succes!');
        } catch (error: any) {
          this.notification.error(error.message);
        } finally {
          this.notification.hideLoading();
        }
      }
    });
  }

  fileName = 'produse.xlsx';
  exportExcel() {
    let data = this.dataSource.data.map((product) => {
      return [
        product.name,
        product.price + ' RON',
        product.stock,
        product.category,
        product.description,
        product.ghidDeIngrijire,
      ];
    });
    data.unshift([
      'Nume',
      'Pret',
      'Cantitate',
      'Categorie',
      'Descriere',
      'Ghid de ingrijire',
    ]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produse'); // de schiimbat din prod in alta denumire
    XLSX.writeFile(wb, this.fileName);
  }

  //De facut importul cu *, de scris in let data proprietatile cum sunt in firebase, in data un unshift - de pus coloanele in ordine, de schimbat numele fileName
  //ex: users.xlsx
}
