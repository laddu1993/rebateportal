import { TestBed } from '@angular/core/testing';

import { NewRebateService } from './new-rebate.service';

describe('NewRebateService', () => {
  let service: NewRebateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRebateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
