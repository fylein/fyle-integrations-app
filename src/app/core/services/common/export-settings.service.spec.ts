import { TestBed } from '@angular/core/testing';
import { ExportSettingsService } from './export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ExportSettingsService', () => {
  let service: ExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
