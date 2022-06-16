import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureValidationComponent } from './signature-validation.component';

describe('SignatureValidationComponent', () => {
  let component: SignatureValidationComponent;
  let fixture: ComponentFixture<SignatureValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
