import { TestBed } from '@angular/core/testing';

import { BusinessCentralEmployeeSettingsService } from './business-central-employee-settings.service';

describe('BusinessCentralEmployeeSettingsService', () => {
  let service: BusinessCentralEmployeeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCentralEmployeeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
