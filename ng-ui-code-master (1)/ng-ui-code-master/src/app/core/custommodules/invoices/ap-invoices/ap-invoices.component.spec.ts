import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApInvoicesComponent } from './ap-invoices.component';

describe('ApInvoicesComponent', () => {
  let component: ApInvoicesComponent;
  let fixture: ComponentFixture<ApInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
