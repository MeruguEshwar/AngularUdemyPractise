import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewI9Component } from './view-i9.component';

describe('ViewI9Component', () => {
  let component: ViewI9Component;
  let fixture: ComponentFixture<ViewI9Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewI9Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewI9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
