import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { W4ViewComponent } from './w4-view.component';

describe('W4ViewComponent', () => {
  let component: W4ViewComponent;
  let fixture: ComponentFixture<W4ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ W4ViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(W4ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
