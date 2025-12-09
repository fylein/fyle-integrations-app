import { TestBed } from '@angular/core/testing';
import { UxeroUcloneUsettingsService } from './xero-clone-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UxeroUcloneUsettingsService', () => {
  let service: UxeroUcloneUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UxeroUcloneUsettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UxeroUcloneUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
