import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface UserData {
  id: string;
  emailAddress: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

const EMAIL_ADDRESSES: string[] = [
  'claudiaolaru15@gmail.com',
  'mmmmmm@yahoo.com',
];

const PHONE_NUMBERS: string[] = ['752647392', '752647392'];

const SUBJECTS: string[] = ['subiect', 'subiect2'];

const MESSAGES: string[] = ['mesaj', 'mesaj2'];

@Component({
  selector: 'table-contact',
  styleUrls: ['./table-contact.component.scss'],
  templateUrl: 'table-contact.component.html',
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
})
export class TableContactComponent {
  displayedColumns: string[] = [
    'id',
    'emailAddress',
    'phoneNumber',
    'subject',
    'message',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    const contact = EMAIL_ADDRESSES.map((EMAIL_ADDRESSES, index) =>
      createContact(
        index + 1,
        EMAIL_ADDRESSES,
        PHONE_NUMBERS[index],
        SUBJECTS[index],
        MESSAGES[index]
      )
    );

    this.dataSource = new MatTableDataSource(contact);
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

function createContact(
  id: number,
  adresaEmail: string,
  numarTelefon: string,
  subiect: string,
  mesaj: string
): UserData {
  return {
    id: id.toString(),
    emailAddress: adresaEmail,
    phoneNumber: numarTelefon,
    subject: subiect,
    message: mesaj,
  };
}
