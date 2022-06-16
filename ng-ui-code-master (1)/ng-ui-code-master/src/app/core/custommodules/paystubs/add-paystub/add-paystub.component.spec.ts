import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaystubComponent } from './add-paystub.component';

describe('AddPaystubComponent', () => {
  let component: AddPaystubComponent;
  let fixture: ComponentFixture<AddPaystubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaystubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaystubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
