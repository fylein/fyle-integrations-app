import { TestBed } from '@angular/core/testing';

import { NetsuiteConnectorService } from './netsuite-connector.service';

xdescribe('NetsuiteConnectorService', () => {
  let service: NetsuiteConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
