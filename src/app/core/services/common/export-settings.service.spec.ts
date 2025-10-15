import { TestBed } from '@angular/core/testing';
import { UexportUsettingsService } from './export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UexportUsettingsService', () => {
  let service: UexportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UexportUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UexportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
