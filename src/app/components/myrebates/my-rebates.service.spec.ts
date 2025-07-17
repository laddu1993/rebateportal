import { TestBed } from '@angular/core/testing';

import { MyRebatesService } from './my-rebates.service';

describe('MyRebatesService', () => {
  let service: MyRebatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyRebatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
