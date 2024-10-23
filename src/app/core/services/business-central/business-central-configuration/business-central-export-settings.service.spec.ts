import { TestBed } from '@angular/core/testing';

import { BusinessCentralExportSettingsService } from './business-central-export-settings.service';

xdescribe('BusinessCentralExportSettingsService', () => {
  let service: BusinessCentralExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
