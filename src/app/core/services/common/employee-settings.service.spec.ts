import { TestBed } from '@angular/core/testing';
import { UemployeeUsettingsService } from './employee-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UemployeeUsettingsService', () => {
  let service: UemployeeUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UemployeeUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UemployeeUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
