import { TestBed } from '@angular/core/testing';

import { BusinessCentralHelperService } from './business-central-helper.service';

xdescribe('BusinessCentralHelperService', () => {
  let service: BusinessCentralHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
