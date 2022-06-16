import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadCustomersComponent } from './bulkupload-customers.component';

describe('BulkuploadCustomersComponent', () => {
  let component: BulkuploadCustomersComponent;
  let fixture: ComponentFixture<BulkuploadCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkuploadCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkuploadCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
