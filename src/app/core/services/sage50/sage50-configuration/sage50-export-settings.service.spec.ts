import { TestBed } from '@angular/core/testing';
import { Usage50UexportUsettingsService } from './sage50-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Usage50UexportUsettingsService', () => {
  let service: Usage50UexportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Usage50UexportUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(Usage50UexportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
