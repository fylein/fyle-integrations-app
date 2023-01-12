import { TestBed } from '@angular/core/testing';

import { QbdFieldMappingService } from './qbd-field-mapping.service';

describe('QbdFieldMappingService', () => {
  let service: QbdFieldMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdFieldMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
