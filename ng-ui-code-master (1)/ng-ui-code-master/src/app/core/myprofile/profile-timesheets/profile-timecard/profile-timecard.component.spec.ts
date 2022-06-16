import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTimecardComponent } from './profile-timecard.component';

describe('ProfileTimecardComponent', () => {
  let component: ProfileTimecardComponent;
  let fixture: ComponentFixture<ProfileTimecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTimecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTimecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
