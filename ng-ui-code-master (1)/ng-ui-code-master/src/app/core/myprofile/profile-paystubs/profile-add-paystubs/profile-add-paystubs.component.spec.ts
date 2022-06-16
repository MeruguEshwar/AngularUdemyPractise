import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAddPaystubsComponent } from './profile-add-paystubs.component';

describe('ProfileAddPaystubsComponent', () => {
  let component: ProfileAddPaystubsComponent;
  let fixture: ComponentFixture<ProfileAddPaystubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAddPaystubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAddPaystubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
