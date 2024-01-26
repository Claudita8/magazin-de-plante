import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotificationService } from '../../service/notification.service';
import { AboutUsService } from '../../service/about-us.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'table-contact',
  styleUrls: ['./table-contact.component.scss'],
  templateUrl: 'table-contact.component.html',
  standalone: true,

  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
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
export class TableContactComponent implements OnInit {
  notification = inject(NotificationService);
  aboutUsService = inject(AboutUsService);
  columnsToDisplay: string[] = ['email', 'phoneNumber', 'address', 'severity'];
  columnNames: any = {
    email: 'Email',
    address: 'Adresa',
    phoneNumber: 'Numar telefon',
    severity: 'Severitate',
    date: 'Data',
    actions: 'Rezolvat',
  };

  columnsToDisplayWithExpand = [
    ...this.columnsToDisplay,
    'date',
    'actions',
    'expand',
  ];
  dataSource!: MatTableDataSource<any>;
  expandedElement: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}
  ngOnInit(): void {
    this.aboutUsService.contactCollection$.subscribe((contact) => {
      this.dataSource = new MatTableDataSource(contact);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filterValue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async updateContact(element: any) {
    if (!element) {
      return;
    }
    try {
      this.notification.showLoading();
      await this.aboutUsService.updateContact({
        ...element,
        isAnswered: !element.isAnswered,
      });

      this.notification.success('Cererea a fost actualizata cu succes!');
    } catch (error: any) {
      this.notification.error(error.message);
    } finally {
      this.notification.hideLoading();
    }
  }
}
