import { TestBed } from '@angular/core/testing';

import { SiExportSettingService } from './si-export-setting.service';

describe('SiExportSettingService', () => {
  let service: SiExportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiExportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
