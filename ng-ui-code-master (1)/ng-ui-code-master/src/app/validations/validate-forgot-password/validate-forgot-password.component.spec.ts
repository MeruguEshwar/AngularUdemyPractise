import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateForgotPasswordComponent } from './validate-forgot-password.component';

describe('ValidateForgotPasswordComponent', () => {
  let component: ValidateForgotPasswordComponent;
  let fixture: ComponentFixture<ValidateForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
