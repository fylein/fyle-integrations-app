import { TestBed } from '@angular/core/testing';

import { SiAdvancedSettingService } from './si-advanced-setting.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SiAdvancedSettingService', () => {
  let service: SiAdvancedSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [SiAdvancedSettingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SiAdvancedSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
