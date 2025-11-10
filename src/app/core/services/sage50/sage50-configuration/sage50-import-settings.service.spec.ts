import { TestBed } from '@angular/core/testing';
import { Sage50ImportSettingsService } from './sage50-import-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Sage50ImportSettingsService', () => {
  let service: Sage50ImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Sage50ImportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Sage50ImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
