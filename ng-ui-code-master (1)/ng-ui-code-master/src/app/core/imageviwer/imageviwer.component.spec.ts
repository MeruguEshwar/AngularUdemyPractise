import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageviwerComponent } from './imageviwer.component';

describe('ImageviwerComponent', () => {
  let component: ImageviwerComponent;
  let fixture: ComponentFixture<ImageviwerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageviwerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageviwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
