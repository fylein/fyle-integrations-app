import { TestBed } from '@angular/core/testing';

import { XeroTokenGuard } from './xero-token.guard';

describe('XeroTokenGuard', () => {
  let guard: XeroTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(XeroTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
