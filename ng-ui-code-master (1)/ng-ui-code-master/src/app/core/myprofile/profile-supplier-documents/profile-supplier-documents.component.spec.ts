import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSupplierDocumentsComponent } from './profile-supplier-documents.component';

describe('ProfileSupplierDocumentsComponent', () => {
  let component: ProfileSupplierDocumentsComponent;
  let fixture: ComponentFixture<ProfileSupplierDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSupplierDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSupplierDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
