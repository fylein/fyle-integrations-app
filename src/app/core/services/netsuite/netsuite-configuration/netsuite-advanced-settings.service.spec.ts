import { TestBed } from '@angular/core/testing';

import { NetsuiteAdvancedSettingsService } from './netsuite-advanced-settings.service';

describe('NetsuiteAdvancedSettingsService', () => {
  let service: NetsuiteAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetsuiteAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
