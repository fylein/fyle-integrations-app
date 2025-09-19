import { TestBed } from '@angular/core/testing';

import { QbdDirectMappingService } from './qbd-direct-mapping.service';

xdescribe('QbdDirectMappingsService', () => {
  let service: QbdDirectMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
