import { TestBed } from '@angular/core/testing';

import { BusinessCentralAuthService } from './business-central-auth.service';

xdescribe('BusinessCentralAuthService', () => {
  let service: BusinessCentralAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
