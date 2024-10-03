import { TestBed } from '@angular/core/testing';

import { XeroHelperService } from './xero-helper.service';

xdescribe('XeroHelperService', () => {
  let service: XeroHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeroHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
