import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProjectDocumentsComponent } from './profile-project-documents.component';

describe('ProfileProjectDocumentsComponent', () => {
  let component: ProfileProjectDocumentsComponent;
  let fixture: ComponentFixture<ProfileProjectDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProjectDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProjectDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
