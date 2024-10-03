import { TestBed } from '@angular/core/testing';

import { XeroTokenGuard } from './xero-token.guard';

xdescribe('XeroTokenGuard', () => {
  let guard: XeroTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(XeroTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
