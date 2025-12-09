import { TestBed } from '@angular/core/testing';
import { UadvancedUsettingsService } from './advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UadvancedUsettingsService', () => {
  let service: UadvancedUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UadvancedUsettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UadvancedUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
