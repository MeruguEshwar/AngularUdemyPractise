import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileI9Component } from './profile-i9.component';

describe('ProfileI9Component', () => {
  let component: ProfileI9Component;
  let fixture: ComponentFixture<ProfileI9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileI9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileI9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
