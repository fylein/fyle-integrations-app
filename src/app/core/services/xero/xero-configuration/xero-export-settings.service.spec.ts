import { TestBed } from '@angular/core/testing';

import { XeroExportSettingsService } from './xero-export-settings.service';

xdescribe('XeroExportSettingsService', () => {
  let service: XeroExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeroExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
