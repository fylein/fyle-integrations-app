import { TestBed } from '@angular/core/testing';
import { UsiUonboardingService } from './si-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUonboardingService', () => {
  let service: UsiUonboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsiUonboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsiUonboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
