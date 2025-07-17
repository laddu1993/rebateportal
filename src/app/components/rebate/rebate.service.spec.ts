import { TestBed } from '@angular/core/testing';

import { RebateService } from './rebate.service';

describe('RebateService', () => {
  let service: RebateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RebateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
