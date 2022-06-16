import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadDesignationsComponent } from './bulkupload-designations.component';

describe('BulkuploadDesignationsComponent', () => {
  let component: BulkuploadDesignationsComponent;
  let fixture: ComponentFixture<BulkuploadDesignationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkuploadDesignationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkuploadDesignationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
