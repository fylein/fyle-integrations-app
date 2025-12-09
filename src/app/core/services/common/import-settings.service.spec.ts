import { TestBed } from '@angular/core/testing';
import { UimportUsettingsService } from './import-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UimportUsettingsService', () => {
  let service: UimportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UimportUsettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UimportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
