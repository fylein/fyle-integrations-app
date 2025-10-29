import { TestBed } from '@angular/core/testing';
import { UtravelperkUpaymentUprofileUsettingsService } from './travelperk-payment-profile-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UtravelperkUpaymentUprofileUsettingsService', () => {
  let service: UtravelperkUpaymentUprofileUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtravelperkUpaymentUprofileUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UtravelperkUpaymentUprofileUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
