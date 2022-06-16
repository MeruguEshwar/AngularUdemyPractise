import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDeskComponent } from './work-desk.component';

describe('WorkDeskComponent', () => {
  let component: WorkDeskComponent;
  let fixture: ComponentFixture<WorkDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
