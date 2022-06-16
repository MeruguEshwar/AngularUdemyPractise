import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingsoonPageComponent } from './comingsoon-page.component';

describe('ComingsoonPageComponent', () => {
  let component: ComingsoonPageComponent;
  let fixture: ComponentFixture<ComingsoonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComingsoonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingsoonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
