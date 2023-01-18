import { TestBed } from '@angular/core/testing';

import { QbdApiService } from './qbd-api.service';

describe('QbdApiService', () => {
  let service: QbdApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
