import { TestBed } from '@angular/core/testing';
import { XeroCloneSettingsService } from './xero-clone-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('XeroCloneSettingsServicee', () => {
  let service: XeroCloneSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XeroCloneSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(XeroCloneSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
