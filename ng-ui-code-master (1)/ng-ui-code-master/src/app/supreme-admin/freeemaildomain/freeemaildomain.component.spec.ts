import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeemaildomainComponent } from './freeemaildomain.component';

describe('FreeemaildomainComponent', () => {
  let component: FreeemaildomainComponent;
  let fixture: ComponentFixture<FreeemaildomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeemaildomainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeemaildomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
