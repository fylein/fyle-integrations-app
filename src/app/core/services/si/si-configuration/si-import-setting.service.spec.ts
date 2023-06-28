import { TestBed } from '@angular/core/testing';

import { SiImportSettingService } from './si-import-setting.service';

describe('SiImportSettingService', () => {
  let service: SiImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
