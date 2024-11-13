import { TestBed } from '@angular/core/testing';
import { QbdDirectConnectorServiceTsService } from './qbd-direct-connector.service.ts.service';

describe('QbdDirectConnectorServiceTsService', () => {
  let service: QbdDirectConnectorServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectConnectorServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
