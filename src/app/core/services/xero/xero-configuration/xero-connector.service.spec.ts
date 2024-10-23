import { TestBed } from '@angular/core/testing';

import { XeroConnectorService } from './xero-connector.service';

xdescribe('XeroConnectorService', () => {
  let service: XeroConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeroConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
