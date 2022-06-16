import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrateComponent } from './payrate.component';

describe('PayrateComponent', () => {
  let component: PayrateComponent;
  let fixture: ComponentFixture<PayrateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
