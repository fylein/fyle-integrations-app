import { TestBed } from '@angular/core/testing';

import { BusinessCentralAdvancedSettingsService } from './business-central-advanced-settings.service';

xdescribe('BusinessCentralAdvancedSettingsService', () => {
  let service: BusinessCentralAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
