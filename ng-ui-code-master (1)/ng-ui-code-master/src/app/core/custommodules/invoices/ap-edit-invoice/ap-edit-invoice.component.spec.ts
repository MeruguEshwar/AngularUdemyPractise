import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApEditInvoiceComponent } from './ap-edit-invoice.component';

describe('ApEditInvoiceComponent', () => {
  let component: ApEditInvoiceComponent;
  let fixture: ComponentFixture<ApEditInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApEditInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApEditInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
