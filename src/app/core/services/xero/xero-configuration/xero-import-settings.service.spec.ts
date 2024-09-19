import { TestBed } from '@angular/core/testing';

import { XeroImportSettingsService } from './xero-import-settings.service';

xdescribe('XeroImportSettingsService', () => {
  let service: XeroImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XeroImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
