import { TestBed } from '@angular/core/testing';

import { BusinessCentralImportSettingsService } from './business-central-import-settings.service';

xdescribe('BusinessCentralImportSettingsService', () => {
  let service: BusinessCentralImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
