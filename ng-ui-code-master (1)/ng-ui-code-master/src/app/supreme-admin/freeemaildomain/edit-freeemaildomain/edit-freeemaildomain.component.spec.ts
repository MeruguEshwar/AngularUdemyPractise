import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFreeemaildomainComponent } from './edit-freeemaildomain.component';

describe('EditFreeemaildomainComponent', () => {
  let component: EditFreeemaildomainComponent;
  let fixture: ComponentFixture<EditFreeemaildomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFreeemaildomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFreeemaildomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
