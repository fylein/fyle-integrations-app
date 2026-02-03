import { TestBed } from '@angular/core/testing';
import { QbdDirectOnboardingService } from './qbd-direct-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QbdDirectOnboardingService', () => {
  let service: QbdDirectOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QbdDirectOnboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QbdDirectOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
