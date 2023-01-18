import { TestBed } from '@angular/core/testing';

import { QbdAuthService } from './qbd-auth.service';

describe('QbdAuthService', () => {
  let service: QbdAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
