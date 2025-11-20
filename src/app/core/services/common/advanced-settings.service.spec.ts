import { TestBed } from '@angular/core/testing';
import { AdvancedSettingsService } from './advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdvancedSettingsService', () => {
  let service: AdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdvancedSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
