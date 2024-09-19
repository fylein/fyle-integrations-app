import { TestBed } from '@angular/core/testing';

import { BusinessCentralTokenGuard } from './business-central-token.guard';

xdescribe('BusinessCentralTokenGuard', () => {
  let guard: BusinessCentralTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BusinessCentralTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
