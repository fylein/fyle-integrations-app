import { TestBed } from '@angular/core/testing';
import { QbdExportSettingsService } from './qbd-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QbdExportSettingsService', () => {
  let service: QbdExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QbdExportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QbdExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
