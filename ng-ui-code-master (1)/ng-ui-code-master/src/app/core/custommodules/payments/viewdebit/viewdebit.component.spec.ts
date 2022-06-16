import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdebitComponent } from './viewdebit.component';

describe('ViewdebitComponent', () => {
  let component: ViewdebitComponent;
  let fixture: ComponentFixture<ViewdebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewdebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
