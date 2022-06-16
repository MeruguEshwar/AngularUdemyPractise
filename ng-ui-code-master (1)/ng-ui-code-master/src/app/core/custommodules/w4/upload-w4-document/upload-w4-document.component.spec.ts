import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadW4DocumentComponent } from './upload-w4-document.component';

describe('UploadW4DocumentComponent', () => {
  let component: UploadW4DocumentComponent;
  let fixture: ComponentFixture<UploadW4DocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadW4DocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadW4DocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
