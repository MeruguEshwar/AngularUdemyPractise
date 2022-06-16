import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProfileDetailsComponent } from './profile-profile-details.component';

describe('ProfileProfileDetailsComponent', () => {
  let component: ProfileProfileDetailsComponent;
  let fixture: ComponentFixture<ProfileProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
