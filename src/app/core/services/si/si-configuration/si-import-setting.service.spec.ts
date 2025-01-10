import { TestBed } from '@angular/core/testing';

import { SiImportSettingService } from './si-import-setting.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SiImportSettingService', () => {
  let service: SiImportSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [SiImportSettingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SiImportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
