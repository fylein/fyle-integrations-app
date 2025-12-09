import { TestBed } from '@angular/core/testing';
import { UsiUexportUsettingsService } from './si-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUexportUsettingsService', () => {
  let service: UsiUexportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsiUexportUsettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsiUexportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
