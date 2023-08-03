import { TestBed } from '@angular/core/testing';

import { IntacctConnectorService } from './intacct-connector.service';

describe('IntacctConnectorService', () => {
  let service: IntacctConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntacctConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
