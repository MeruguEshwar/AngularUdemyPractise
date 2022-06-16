import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCompanyApproverComponent } from './assign-company-approver.component';

describe('AssignCompanyApproverComponent', () => {
  let component: AssignCompanyApproverComponent;
  let fixture: ComponentFixture<AssignCompanyApproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCompanyApproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCompanyApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
