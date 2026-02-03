import { TestBed } from '@angular/core/testing';
import { SiImportSettingsService } from './si-import-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SiImportSettingsService', () => {
  let service: SiImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiImportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SiImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
