import { TestBed } from '@angular/core/testing';

import { QboConnectorService } from './qbo-connector.service';

xdescribe('QboConnectorService', () => {
  let service: QboConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QboConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
