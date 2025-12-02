import { TestBed } from '@angular/core/testing';
import { NetsuiteOnboardingService } from './netsuite-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NetsuiteOnboardingService', () => {
  let service: NetsuiteOnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetsuiteOnboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(NetsuiteOnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
