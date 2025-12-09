import { TestBed } from '@angular/core/testing';
import { Usage50UonboardingService } from './sage50-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Usage50UonboardingService', () => {
  let service: Usage50UonboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Usage50UonboardingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(Usage50UonboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
