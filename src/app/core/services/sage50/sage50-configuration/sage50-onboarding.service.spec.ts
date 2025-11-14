import { TestBed } from '@angular/core/testing';
import { Sage50OnboardingService } from './sage50-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Sage50OnboardingService', () => {
  let service: Sage50OnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Sage50OnboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Sage50OnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
