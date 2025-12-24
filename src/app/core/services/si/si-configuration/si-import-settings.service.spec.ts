import { TestBed } from '@angular/core/testing';
import { UsiUimportUsettingsService } from './si-import-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUimportUsettingsService', () => {
  let service: UsiUimportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsiUimportUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsiUimportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
