import { TestBed } from '@angular/core/testing';

import { QbdAdvancedSettingService } from './qbd-advanced-setting.service';

describe('QbdAdvancedSettingService', () => {
  let service: QbdAdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdAdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
