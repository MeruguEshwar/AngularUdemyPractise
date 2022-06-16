import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeTabsComponent } from './add-employee-tabs.component';

describe('AddEmployeeTabsComponent', () => {
  let component: AddEmployeeTabsComponent;
  let fixture: ComponentFixture<AddEmployeeTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
