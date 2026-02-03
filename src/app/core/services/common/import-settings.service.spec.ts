import { TestBed } from '@angular/core/testing';
import { ImportSettingsService } from './import-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ImportSettingsService', () => {
  let service: ImportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ImportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
