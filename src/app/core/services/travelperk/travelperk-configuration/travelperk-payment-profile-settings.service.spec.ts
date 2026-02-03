import { TestBed } from '@angular/core/testing';
import { TravelperkPaymentProfileSettingsService } from './travelperk-payment-profile-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TravelperkPaymentProfileSettingsService', () => {
  let service: TravelperkPaymentProfileSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TravelperkPaymentProfileSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TravelperkPaymentProfileSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
