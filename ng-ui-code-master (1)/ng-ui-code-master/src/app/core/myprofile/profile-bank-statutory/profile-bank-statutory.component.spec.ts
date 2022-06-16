import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBankStatutoryComponent } from './profile-bank-statutory.component';

describe('ProfileBankStatutoryComponent', () => {
  let component: ProfileBankStatutoryComponent;
  let fixture: ComponentFixture<ProfileBankStatutoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileBankStatutoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBankStatutoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
