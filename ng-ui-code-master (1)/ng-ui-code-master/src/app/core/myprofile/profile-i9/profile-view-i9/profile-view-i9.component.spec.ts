import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewI9Component } from './profile-view-i9.component';

describe('ProfileViewI9Component', () => {
  let component: ProfileViewI9Component;
  let fixture: ComponentFixture<ProfileViewI9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewI9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewI9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
