import { TestBed } from '@angular/core/testing';

import { QbdDirectMappingsService } from './qbd-direct-mappings.service';

describe('QbdDirectMappingsService', () => {
  let service: QbdDirectMappingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectMappingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
