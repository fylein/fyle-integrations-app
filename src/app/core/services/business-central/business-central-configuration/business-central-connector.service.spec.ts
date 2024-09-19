import { TestBed } from '@angular/core/testing';

import { BusinessCentralConnectorService } from './business-central-connector.service';

xdescribe('BusinessCentralConnectorService', () => {
  let service: BusinessCentralConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
