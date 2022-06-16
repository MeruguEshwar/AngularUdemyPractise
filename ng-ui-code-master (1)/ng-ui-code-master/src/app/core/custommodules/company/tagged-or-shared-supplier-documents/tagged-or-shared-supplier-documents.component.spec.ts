import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedOrSharedSupplierDocumentsComponent } from './tagged-or-shared-supplier-documents.component';

describe('TaggedOrSharedSupplierDocumentsComponent', () => {
  let component: TaggedOrSharedSupplierDocumentsComponent;
  let fixture: ComponentFixture<TaggedOrSharedSupplierDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedOrSharedSupplierDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedOrSharedSupplierDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
