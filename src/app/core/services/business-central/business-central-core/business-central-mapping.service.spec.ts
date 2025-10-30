import { TestBed } from '@angular/core/testing';

import { BusinessCentralMappingService } from './business-central-mapping.service';

xdescribe('BusinessCentralMappingService', () => {
  let service: BusinessCentralMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
