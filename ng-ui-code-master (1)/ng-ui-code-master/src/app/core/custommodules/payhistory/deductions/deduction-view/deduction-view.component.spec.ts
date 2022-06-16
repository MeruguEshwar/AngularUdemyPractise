import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionViewComponent } from './deduction-view.component';

describe('DeductionViewComponent', () => {
  let component: DeductionViewComponent;
  let fixture: ComponentFixture<DeductionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeductionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
