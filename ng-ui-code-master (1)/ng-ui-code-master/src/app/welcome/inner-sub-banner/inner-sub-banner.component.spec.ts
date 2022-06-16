import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerSubBannerComponent } from './inner-sub-banner.component';

describe('InnerSubBannerComponent', () => {
  let component: InnerSubBannerComponent;
  let fixture: ComponentFixture<InnerSubBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerSubBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerSubBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
