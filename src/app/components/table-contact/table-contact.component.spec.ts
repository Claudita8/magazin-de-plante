import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContactComponent } from './table-contact.component';

describe('TableContactComponent', () => {
  let component: TableContactComponent;
  let fixture: ComponentFixture<TableContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
