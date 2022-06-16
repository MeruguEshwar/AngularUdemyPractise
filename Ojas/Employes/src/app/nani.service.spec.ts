import { TestBed } from '@angular/core/testing';

import { NaniService } from './nani.service';

describe('NaniService', () => {
  let service: NaniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
