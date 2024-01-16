import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { TableProductsComponent } from '../table-products/table-products.component';
import { TableOrdersComponent } from '../table-orders/table-orders.component';
import { TableUsersComponent } from '../table-users/table-users.component';

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
  ],
})
export class AdministratorComponent {
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  // data = [
  //   {
  //     id: 1,
  //     nume: 'Conifere mixte',
  //     descriere: 'Descriere',
  //     pret: 29.99,
  //     stoc: 100,
  //     ghidDeIngrijire: 'Ghid ',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 2,
  //     nume: 'Brad ghiveci',
  //     descriere: 'Descriere',
  //     pret: 229.99,
  //     stoc: 70,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 3,
  //     nume: 'Craciunita sezoniera',
  //     descriere: 'Descriere',
  //     pret: 60,
  //     stoc: 400,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 4,
  //     nume: 'Brad ghiveci',
  //     descriere: 'Descriere',
  //     pret: 259.99,
  //     stoc: 320,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 5,
  //     nume: 'Marantha - talie mica',
  //     descriere: 'Descriere',
  //     pret: 25,
  //     stoc: 170,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 6,
  //     nume: 'Lamai Meyer',
  //     descriere: 'Descriere',
  //     pret: 160,
  //     stoc: 300,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 7,
  //     nume: 'Trifoi norocos',
  //     descriere: 'Descriere',
  //     pret: 18.9,
  //     stoc: 250,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 8,
  //     nume: 'Aloe interstellar',
  //     descriere: 'Descriere',
  //     pret: 99.99,
  //     stoc: 240,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 9,
  //     nume: 'Orhidee Phalaenopsis',
  //     descriere: 'Descriere',
  //     pret: 200,
  //     stoc: 180,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  //   {
  //     id: 10,
  //     nume: 'Ardisia',
  //     descriere: 'Descriere',
  //     pret: 82,
  //     stoc: 200,
  //     ghidDeIngrijire: 'Ghid',
  //     solicitari: 100,
  //     comenzi: 70,
  //   },
  // ];
  // // selectedTabIndex: number = 0;
  // // displayedColumns: string[] = [];
  // // dataSource: MatTableDataSource<any>;
  // // input: any;
  // displayedColumnsMap: { [key: string]: string[] } = {
  //   products: ['id', 'nume', 'descriere', 'pret', 'stoc', 'ghidDeIngrijire'],
  //   orders: ['id', 'nume', 'pret', 'stoc', 'solicitari'],
  //   users: ['id', 'nume', 'pret', 'stoc', 'comenzi'],
  // };
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  // constructor() {
  //   this.dataSource = new MatTableDataSource(this.data);
  // }
  //   ngAfterViewInit() {
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     /*this.onTabChanged(0);*/
  //   }
  //   onTabChanged(event: any) {
  //     const tabKey = this.getTabKey(event.index);
  //     this.selectedTabIndex = event.index;
  //     this.displayedColumns = this.displayedColumnsMap[tabKey] || [];
  //   }
  //   getTabKey(index: number): string {
  //     switch (index) {
  //       case 0:
  //         return 'products';
  //       case 1:
  //         return 'orders';
  //       case 2:
  //         return 'users';
  //       default:
  //         return '';
  //     }
  //   }
}
