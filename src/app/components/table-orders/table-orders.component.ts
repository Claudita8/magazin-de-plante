import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrdersService } from '../../service/orders.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'table-orders',
  styleUrls: ['./table-orders.component.scss'],
  templateUrl: 'table-orders.component.html',
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class TableOrdersComponent implements OnInit {
  orderService = inject(OrdersService);
  columnsToDisplay: string[] = [
    'lastName',
    'name',
    'address',
    'email',
    'phoneNumber',
    'totalPrice',
  ];
  columnNames: any = {
    lastName: 'Nume Familie',
    name: 'Prenume',
    address: 'Adresa',
    email: 'Email',
    phoneNumber: 'Telefon',
    totalPrice: 'Suma totala in RON',
  };

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.orderService.orders$.subscribe((orders) => {
      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  fileName = 'orders.xlsx';
  exportExcel() {
    let data = this.dataSource.data.map((orders) => {
      return [
        orders.lastName,
        orders.name,
        orders.address,
        orders.email,
        orders.date,
        orders.phoneNumber,
        orders.totalPrice,
      ];
    });
    data.unshift([
      'Nume de familie',
      'Prenume',
      'Adresa',
      'Email',
      'Data',
      'Numar de telefon',
      'Pret total (RON)',
    ]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, this.fileName);
  }
}
