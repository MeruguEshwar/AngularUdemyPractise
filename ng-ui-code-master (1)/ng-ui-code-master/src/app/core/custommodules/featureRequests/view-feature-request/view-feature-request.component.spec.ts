import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeatureRequestComponent } from './view-feature-request.component';

describe('ViewFeatureRequestComponent', () => {
  let component: ViewFeatureRequestComponent;
  let fixture: ComponentFixture<ViewFeatureRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFeatureRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeatureRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
