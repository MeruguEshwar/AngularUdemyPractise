import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadI9DocumentComponent } from './upload-i9-document.component';

describe('UploadI9DocumentComponent', () => {
  let component: UploadI9DocumentComponent;
  let fixture: ComponentFixture<UploadI9DocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadI9DocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadI9DocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
