import { TestBed } from '@angular/core/testing';
import { EmployeeSettingsService } from './employee-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EmployeeSettingsService', () => {
  let service: EmployeeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmployeeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
