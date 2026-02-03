import { TestBed } from '@angular/core/testing';

import { QboTokenGuard } from './qbo-token.guard';

describe('QboTokenGuard', () => {
  let guard: QboTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QboTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
