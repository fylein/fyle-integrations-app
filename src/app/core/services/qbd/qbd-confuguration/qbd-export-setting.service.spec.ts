import { TestBed } from '@angular/core/testing';

import { QbdExportSettingService } from './qbd-export-setting.service';

describe('QbdExportSettingService', () => {
  let service: QbdExportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QbdExportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
