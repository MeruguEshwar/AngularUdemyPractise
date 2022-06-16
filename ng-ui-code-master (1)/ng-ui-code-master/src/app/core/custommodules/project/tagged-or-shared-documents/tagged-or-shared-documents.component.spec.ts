import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedOrSharedDocumentsComponent } from './tagged-or-shared-documents.component';

describe('TaggedOrSharedDocumentsComponent', () => {
  let component: TaggedOrSharedDocumentsComponent;
  let fixture: ComponentFixture<TaggedOrSharedDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedOrSharedDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedOrSharedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
