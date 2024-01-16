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
  email: string;
  solicitare: string;
}

const DATES: Date[] = [
  new Date(),
  new Date('2023-01-15'),
  new Date('2023-02-28'),
  new Date('2023-03-10'),
  new Date('2023-04-05'),
  new Date('2023-05-20'),
  new Date('2023-06-07'),
  new Date('2023-07-12'),
  new Date('2023-08-22'),
  new Date('2023-09-30'),
];

const USERS: string[] = [
  'John Doe',
  'Jane Smith',
  'Robert Johnson',
  'Emma White',
  'Michael Brown',
  'Olivia Davis',
  'William Wilson',
  'Sophia Jones',
  'James Taylor',
  'Ava Lee',
];

const EMAILS: string[] = [
  'john.doe@example.com',
  'jane.smith@example.com',
  'robert.johnson@example.com',
  'emma.white@example.com',
  'michael.brown@example.com',
  'olivia.davis@example.com',
  'william.wilson@example.com',
  'sophia.jones@example.com',
  'james.taylor@example.com',
  'ava.lee@example.com',
];

const REQUESTS: string[] = [
  'Solicitare de asistență pentru produsul Conifere.',
  'Întrebare privind starea comenzii pentru comanda #12345.',
  'Asistență pentru crearea unui cont nou.',
  'Asistență tehnică necesară pentru autentificarea contului.',
  'Cerere de facturare pentru factura #67890.',
  'Feedback despre achiziția recentă.',
  'Plângere privind timpul de nefuncționare a serviciului.',
  'Feedback despre achiziția recentă.',
  'Asistență pentru crearea unui cont nou.',
  'întrebare cu privire la promoțiile viitoare.',
];

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
  ],
})
export class TableUsersComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'data',
    'utilizator',
    'email',
    'solicitare',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    const users = USERS.map((USERS, index) =>
      createNewUser(
        index + 1,
        DATES[index],
        USERS,
        EMAILS[index],
        REQUESTS[index]
      )
    );

    this.dataSource = new MatTableDataSource(users);
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

function createNewUser(
  id: number,
  data: Date,
  utilizator: string,
  email: string,
  solicitare: string
): UserData {
  return {
    id: id.toString(),
    data: data,
    utilizator: utilizator,
    email: email,
    solicitare: solicitare,
  };
}
