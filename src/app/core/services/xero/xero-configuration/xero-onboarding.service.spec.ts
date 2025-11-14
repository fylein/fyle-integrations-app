import { TestBed } from '@angular/core/testing';
import { XeroOnboardingService } from './xero-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('XeroOnboardingService', () => {
  let service: XeroOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XeroOnboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(XeroOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
