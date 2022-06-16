import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApViewInvoiceComponent } from './ap-view-invoice.component';

describe('ApViewInvoiceComponent', () => {
  let component: ApViewInvoiceComponent;
  let fixture: ComponentFixture<ApViewInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApViewInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApViewInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
