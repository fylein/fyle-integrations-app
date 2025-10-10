import { TestBed } from '@angular/core/testing';

import { SiImportSettingsService } from './si-import-settings.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SiImportSettingsService', () => {
  let service: SiImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [SiImportSettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SiImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
