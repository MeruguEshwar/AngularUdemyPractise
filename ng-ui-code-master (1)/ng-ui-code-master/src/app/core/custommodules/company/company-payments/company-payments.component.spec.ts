import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPaymentsComponent } from './company-payments.component';

describe('CompanyPaymentsComponent', () => {
  let component: CompanyPaymentsComponent;
  let fixture: ComponentFixture<CompanyPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
