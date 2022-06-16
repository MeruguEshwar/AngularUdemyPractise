import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEVerifyComponent } from './profile-e-verify.component';

describe('ProfileEVerifyComponent', () => {
  let component: ProfileEVerifyComponent;
  let fixture: ComponentFixture<ProfileEVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
