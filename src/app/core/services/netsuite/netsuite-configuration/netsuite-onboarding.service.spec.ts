import { TestBed } from '@angular/core/testing';
import { UnetsuiteUonboardingService } from './netsuite-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UnetsuiteUonboardingService', () => {
  let service: UnetsuiteUonboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnetsuiteUonboardingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UnetsuiteUonboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
