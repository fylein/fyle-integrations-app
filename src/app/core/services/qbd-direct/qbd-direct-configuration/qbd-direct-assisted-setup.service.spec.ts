import { TestBed } from '@angular/core/testing';
import { UqbdUdirectUassistedUsetupService } from './qbd-direct-assisted-setup.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UqbdUdirectUassistedUsetupService', () => {
  let service: UqbdUdirectUassistedUsetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UqbdUdirectUassistedUsetupService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UqbdUdirectUassistedUsetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
