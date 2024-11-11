import { TestBed } from '@angular/core/testing';
import { QbdDirectConnectorService } from './qbd-direct-connector.service';

describe('QbdDirectConnectorServiceTsService', () => {
  let service: QbdDirectConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdDirectConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
