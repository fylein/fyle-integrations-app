import { TestBed } from '@angular/core/testing';

import { QbdDirectAuthService } from './qbd-direct-auth.service';

xdescribe('QbdDirectAuthService', () => {
  let service: QbdDirectAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
