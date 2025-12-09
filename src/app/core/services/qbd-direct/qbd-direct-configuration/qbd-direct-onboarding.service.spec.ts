import { TestBed } from '@angular/core/testing';
import { UqbdUdirectUonboardingService } from './qbd-direct-onboarding.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UqbdUdirectUonboardingService', () => {
  let service: UqbdUdirectUonboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UqbdUdirectUonboardingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UqbdUdirectUonboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
