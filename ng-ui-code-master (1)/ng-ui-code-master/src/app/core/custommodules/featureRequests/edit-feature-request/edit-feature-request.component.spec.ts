import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeatureRequestComponent } from './edit-feature-request.component';

describe('EditFeatureRequestComponent', () => {
  let component: EditFeatureRequestComponent;
  let fixture: ComponentFixture<EditFeatureRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFeatureRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFeatureRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
