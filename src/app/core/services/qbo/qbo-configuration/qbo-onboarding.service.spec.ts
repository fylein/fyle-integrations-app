import { TestBed } from '@angular/core/testing';
import { UqboUonboardingService } from './qbo-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UqboUonboardingService', () => {
  let service: UqboUonboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UqboUonboardingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UqboUonboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
