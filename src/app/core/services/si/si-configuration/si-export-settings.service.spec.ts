import { TestBed } from '@angular/core/testing';
import { SiExportSettingsService } from './si-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SiExportSettingsService', () => {
  let service: SiExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiExportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SiExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
