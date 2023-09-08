import { TestBed } from '@angular/core/testing';

import { QbdMappingService } from './qbd-mapping.service';

describe('QbdMappingService', () => {
  let service: QbdMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
