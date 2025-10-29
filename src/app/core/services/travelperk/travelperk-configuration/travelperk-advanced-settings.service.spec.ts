import { TestBed } from '@angular/core/testing';
import { TravelperkAdvancedSettingsService } from './travelperk-advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TravelperkAdvancedSettingsService', () => {
  let service: TravelperkAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TravelperkAdvancedSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TravelperkAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
