import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmigrationsComponent } from './immigrations.component';

describe('ImmigrationsComponent', () => {
  let component: ImmigrationsComponent;
  let fixture: ComponentFixture<ImmigrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmigrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmigrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
