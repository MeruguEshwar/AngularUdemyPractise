import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileW4Component } from './profile-w4.component';

describe('ProfileW4Component', () => {
  let component: ProfileW4Component;
  let fixture: ComponentFixture<ProfileW4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileW4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileW4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
