import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignResourceComponent } from './assign-resource.component';

describe('AssignResourceComponent', () => {
  let component: AssignResourceComponent;
  let fixture: ComponentFixture<AssignResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
