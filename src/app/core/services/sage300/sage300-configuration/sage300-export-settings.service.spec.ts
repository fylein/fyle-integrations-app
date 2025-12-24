import { TestBed } from '@angular/core/testing';
import { Usage300UexportUsettingsService } from './sage300-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Usage300UexportUsettingsService', () => {
  let service: Usage300UexportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Usage300UexportUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Usage300UexportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
