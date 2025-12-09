import { TestBed } from '@angular/core/testing';
import { UsiUadvancedUsettingsService } from './si-advanced-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUadvancedUsettingsService', () => {
  let service: UsiUadvancedUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsiUadvancedUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UsiUadvancedUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
