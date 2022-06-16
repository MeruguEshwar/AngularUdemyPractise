import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaystubComponent } from './view-paystub.component';

describe('ViewPaystubComponent', () => {
  let component: ViewPaystubComponent;
  let fixture: ComponentFixture<ViewPaystubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPaystubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaystubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
