import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyI9Component } from './verify-i9.component';

describe('VerifyI9Component', () => {
  let component: VerifyI9Component;
  let fixture: ComponentFixture<VerifyI9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyI9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyI9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
