import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkForceComponent } from './work-force.component';

describe('WorkForceComponent', () => {
  let component: WorkForceComponent;
  let fixture: ComponentFixture<WorkForceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkForceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkForceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
