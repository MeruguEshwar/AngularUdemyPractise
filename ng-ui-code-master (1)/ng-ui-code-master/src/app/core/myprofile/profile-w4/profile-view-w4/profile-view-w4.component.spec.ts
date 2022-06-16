import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewW4Component } from './profile-view-w4.component';

describe('ProfileViewW4Component', () => {
  let component: ProfileViewW4Component;
  let fixture: ComponentFixture<ProfileViewW4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewW4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewW4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
