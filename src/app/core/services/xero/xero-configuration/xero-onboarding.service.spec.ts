import { TestBed } from '@angular/core/testing';
import { UxeroUonboardingService } from './xero-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UxeroUonboardingService', () => {
  let service: UxeroUonboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UxeroUonboardingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UxeroUonboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
