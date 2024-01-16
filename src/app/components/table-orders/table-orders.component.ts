import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface UserData {
  id: string;
  data: Date;
  utilizator: string;
  adresa: string;
  pretTotal: string;
  produseComandate: string;
}

const DATES: Date[] = [
  new Date('2023-01-01'),
  new Date('2023-03-15'),
  new Date('2023-03-10'),
  new Date('2023-05-05'),
  new Date('2023-05-20'),
  new Date('2023-06-07'),
  new Date('2023-08-12'),
  new Date('2023-08-22'),
  new Date('2023-09-30'),
  new Date('2023-10-15'),
];

const USERS: string[] = [
  'Popescu Ana',
  'Andrei Ionela',
  'Stan Marin',
  'Golescu Maria',
  'Vuta Iulian',
  'Ionescu Andreea',
  'Galos Ionut',
  'Popescu Ancas',
  'Codreanu Ovidiu',
  'Istrate Alina',
];

const ADDRESSES: string[] = [
  'Dolj, Str. Stejarului, nr 78',
  'Sibiu, Str. Izvorului, nr 25',
  'Constanta, Bd Mare, nr 75',
  'Braila, Str. Soarelui, nr 88',
  'Cluj-Napoca, Str. Fericirii, nr 123',
  'Ialomita,Str.Ghimpati, nr 59',
  'Arad, Str. Morii, nr 15',
  'Mehedinti, Str. Libertatii, nr 102',
  'Bucuresti, Bd Frumusetii, 115',
  'Pitesti, Str Republicii, 92',
];

const FINAL_PRICES: number[] = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

const PRODUCTS_ORDERED: string[] = [
  'Product A',
  'Product B',
  'Product C',
  'Product D',
  'Product E',
  'Product F',
  'Product G',
  'Product H',
  'Product I',
  'Product J',
];

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
}
