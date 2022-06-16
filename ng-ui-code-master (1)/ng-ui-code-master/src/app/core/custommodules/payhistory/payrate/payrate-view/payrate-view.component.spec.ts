import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrateViewComponent } from './payrate-view.component';

describe('PayrateViewComponent', () => {
  let component: PayrateViewComponent;
  let fixture: ComponentFixture<PayrateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
