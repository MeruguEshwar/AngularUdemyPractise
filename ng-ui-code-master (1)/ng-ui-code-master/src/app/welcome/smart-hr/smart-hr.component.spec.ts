import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartHrComponent } from './smart-hr.component';

describe('SmartHrComponent', () => {
  let component: SmartHrComponent;
  let fixture: ComponentFixture<SmartHrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartHrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
