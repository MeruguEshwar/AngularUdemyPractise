import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTimesheetsComponent } from './profile-timesheets.component';

describe('ProfileTimesheetsComponent', () => {
  let component: ProfileTimesheetsComponent;
  let fixture: ComponentFixture<ProfileTimesheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTimesheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
