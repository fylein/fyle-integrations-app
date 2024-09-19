import { TestBed } from '@angular/core/testing';

import { SiImportSettingService } from './si-import-setting.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('SiImportSettingService', () => {
  let service: SiImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiImportSettingService]
    });
    service = TestBed.inject(SiImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
