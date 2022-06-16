import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpencesComponent } from './expences.component';

describe('ExpencesComponent', () => {
  let component: ExpencesComponent;
  let fixture: ComponentFixture<ExpencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
