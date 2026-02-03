import { TestBed } from '@angular/core/testing';
import { IntacctOnboardingService } from './si-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('IntacctOnboardingService', () => {
  let service: IntacctOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IntacctOnboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IntacctOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
