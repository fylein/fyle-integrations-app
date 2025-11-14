import { TestBed } from '@angular/core/testing';
import { Sage300ExportSettingsService } from './sage300-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Sage300ExportSettingsService', () => {
  let service: Sage300ExportSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Sage300ExportSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Sage300ExportSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
