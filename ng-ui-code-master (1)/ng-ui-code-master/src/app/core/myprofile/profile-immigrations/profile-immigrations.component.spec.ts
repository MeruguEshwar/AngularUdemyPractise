import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImmigrationsComponent } from './profile-immigrations.component';

describe('ProfileImmigrationsComponent', () => {
  let component: ProfileImmigrationsComponent;
  let fixture: ComponentFixture<ProfileImmigrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImmigrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImmigrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
