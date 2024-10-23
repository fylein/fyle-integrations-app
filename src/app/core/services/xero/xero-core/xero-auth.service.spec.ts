import { TestBed } from '@angular/core/testing';

import { XeroAuthService } from './xero-auth.service';

xdescribe('XeroAuthService', () => {
  let service: XeroAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeroAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
