import { TestBed } from '@angular/core/testing';

import { QbdIifLogsService } from './qbd-iif-logs.service';

describe('QbdIifLogsService', () => {
  let service: QbdIifLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdIifLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
