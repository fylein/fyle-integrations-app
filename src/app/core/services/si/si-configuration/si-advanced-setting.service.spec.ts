import { TestBed } from '@angular/core/testing';

import { SiAdvancedSettingService } from './si-advanced-setting.service';

describe('SiAdvancedSettingService', () => {
  let service: SiAdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiAdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
