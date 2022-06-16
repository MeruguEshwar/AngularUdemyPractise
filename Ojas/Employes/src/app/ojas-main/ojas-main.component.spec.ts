import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OjasMainComponent } from './ojas-main.component';

describe('OjasMainComponent', () => {
  let component: OjasMainComponent;
  let fixture: ComponentFixture<OjasMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OjasMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OjasMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
