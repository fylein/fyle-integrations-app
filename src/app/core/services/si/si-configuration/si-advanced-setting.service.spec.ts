import { TestBed } from '@angular/core/testing';

import { SiAdvancedSettingService } from './si-advanced-setting.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('SiAdvancedSettingService', () => {
  let service: SiAdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiAdvancedSettingService]
    });
    service = TestBed.inject(SiAdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
