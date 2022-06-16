import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { I9W4SignatureModelComponent } from './i9-w4-signature-model.component';

describe('I9W4SignatureModelComponent', () => {
  let component: I9W4SignatureModelComponent;
  let fixture: ComponentFixture<I9W4SignatureModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ I9W4SignatureModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(I9W4SignatureModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
