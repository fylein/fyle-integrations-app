import { TestBed } from '@angular/core/testing';
import { Usage50UimportUsettingsService } from './sage50-import-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Usage50UimportUsettingsService', () => {
  let service: Usage50UimportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Usage50UimportUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(Usage50UimportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
