import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationDetailsComponent } from './my-organization-details.component';

describe('MyOrganizationDetailsComponent', () => {
  let component: MyOrganizationDetailsComponent;
  let fixture: ComponentFixture<MyOrganizationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrganizationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrganizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
