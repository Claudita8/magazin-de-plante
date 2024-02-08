import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import * as XLSX from 'xlsx';

export interface UserData {
  id: string;
  data: Date;
  utilizator: string;
  adresa: string;
  pretTotal: string;
  produseComandate: string;
}

const DATES: Date[] = [];

const USERS: string[] = [];

const ADDRESSES: string[] = [];

const FINAL_PRICES: number[] = [];

const PRODUCTS_ORDERED: string[] = [];

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
export class TableOrdersComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'data',
    'utilizator',
    'adresa',
    'pretTotal',
    'produseComandate',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    const orders = USERS.map((USERS, index) =>
      createNewOrder(
        index + 1,
        DATES[index],
        USERS,
        ADDRESSES[index],
        FINAL_PRICES[index],
        PRODUCTS_ORDERED[index]
      )
    );

    this.dataSource = new MatTableDataSource(orders);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function createNewOrder(
  id: number,
  data: Date,
  utilizator: string,
  adresa: string,
  pretTotal: number,
  produseComandate: string
): UserData {
  const pretTot = pretTotal.toString();

  return {
    id: id.toString(),
    data: data,
    utilizator: utilizator,
    adresa: adresa,
    pretTotal: pretTot,
    produseComandate: produseComandate,
  };

  // fileName = 'orders.xlsx';
  // exportExcel() {
  //   let data = this.dataSource.data.map((orders) => {
  //     return [
  //       orders.name,
       
  //     ];
  //   });
  //   data.unshift([
  //     'Nume',
  //     'Pret',
  //     'Cantitate',
  //     'Categorie',
  //     'Descriere',
  //     'Ghid de ingrijire',
  //   ]);
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Produse'); // de schiimbat din prod in alta denumire
  //   XLSX.writeFile(wb, this.fileName);
  // }
}
