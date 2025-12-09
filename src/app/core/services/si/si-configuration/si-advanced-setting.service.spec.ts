import { TestBed } from '@angular/core/testing';

import { SiAdvancedSettingsService } from './si-advanced-settings.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SiAdvancedSettingsService', () => {
  let service: SiAdvancedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SiAdvancedSettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(SiAdvancedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
