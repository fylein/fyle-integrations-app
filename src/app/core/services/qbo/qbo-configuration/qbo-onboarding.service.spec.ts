import { TestBed } from '@angular/core/testing';
import { QboOnboardingService } from './qbo-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QboOnboardingService', () => {
  let service: QboOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QboOnboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QboOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
