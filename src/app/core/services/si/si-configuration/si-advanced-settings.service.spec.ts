import { TestBed } from '@angular/core/testing';
import { SiAdvancedSettingsService } from './si-advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SiAdvancedSettingsService', () => {
  let service: SiAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SiAdvancedSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SiAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
