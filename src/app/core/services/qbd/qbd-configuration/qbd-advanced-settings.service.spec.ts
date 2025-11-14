import { TestBed } from '@angular/core/testing';
import { QbdAdvancedSettingsService } from './qbd-advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QbdAdvancedSettingsService', () => {
  let service: QbdAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QbdAdvancedSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QbdAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
