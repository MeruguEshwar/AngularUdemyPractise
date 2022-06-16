import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePaystubsComponent } from './profile-paystubs.component';

describe('ProfilePaystubsComponent', () => {
  let component: ProfilePaystubsComponent;
  let fixture: ComponentFixture<ProfilePaystubsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePaystubsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePaystubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
