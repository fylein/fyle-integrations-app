import { TestBed } from '@angular/core/testing';

import { QbdUserService } from './qbd-user.service';

describe('QbdUserService', () => {
  let service: QbdUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
