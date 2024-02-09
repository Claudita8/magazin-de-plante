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
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

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
import { UserListService } from '../../service/user-list.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'table-users',
  styleUrls: ['./table-users.component.scss'],
  templateUrl: 'table-users.component.html',
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
    MatSlideToggleModule,
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
export class TableUsersComponent implements OnInit {
  usertListService = inject(UserListService);
  notification = inject(NotificationService);
  columnsToDisplay: string[] = [
    'photoURL',
    'firstName',
    'lastName',
    'displayName',
    'phoneNumber',
    'address',
    'actions',
  ];
  columnNames: any = {
    photoURL: 'Poza profil',
    firstName: 'Prenume',
    lastName: 'Nume familie',
    displayName: 'Nume Afisat',
    phoneNumber: 'Telefon',
    address: 'Adresa',
  };

  dataSource!: MatTableDataSource<any>;
  expandedElement: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}
  ngOnInit(): void {
    this.usertListService.getUsersList().subscribe((user) => {
      this.dataSource = new MatTableDataSource(user);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAdminToggleChange(userId: string, event: MatSlideToggleChange) {
    this.usertListService.updateUser(userId, event.checked);
  }

  fileName = 'users.xlsx';
  exportExcel() {
    let data = this.dataSource.data.map((users) => {
      return [
        users.email,
        users.isAdmin ? 'Da' : 'Nu',
        users.lastName,
        users.firstName,
        users.displayName,
        users.phoneNumber,
        users.address,
      ];
    });
    data.unshift([
      'Email',
      'Este Admin',
      'Nume de familie',
      'Prenume',
      'Porecla',
      'Numar de telefon',
      'Adresa',
    ]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, this.fileName);
  }
}
