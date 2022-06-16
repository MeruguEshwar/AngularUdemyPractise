import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadDepartmentsComponent } from './bulkupload-departments.component';

describe('BulkuploadDepartmentsComponent', () => {
  let component: BulkuploadDepartmentsComponent;
  let fixture: ComponentFixture<BulkuploadDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkuploadDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkuploadDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
