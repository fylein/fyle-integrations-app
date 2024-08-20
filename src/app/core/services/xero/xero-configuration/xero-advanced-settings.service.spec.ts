import { TestBed } from '@angular/core/testing';

import { XeroAdvancedSettingsService } from './xero-advanced-settings.service';

xdescribe('XeroAdvancedSettingsService', () => {
  let service: XeroAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeroAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
