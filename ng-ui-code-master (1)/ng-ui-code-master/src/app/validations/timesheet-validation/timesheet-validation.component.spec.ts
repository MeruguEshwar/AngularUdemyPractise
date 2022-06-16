import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetValidationComponent } from './timesheet-validation.component';

describe('TimesheetValidationComponent', () => {
  let component: TimesheetValidationComponent;
  let fixture: ComponentFixture<TimesheetValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
