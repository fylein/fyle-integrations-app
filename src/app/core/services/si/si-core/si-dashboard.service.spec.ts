import { TestBed } from '@angular/core/testing';
import { UsiUdashboardService } from './si-dashboard.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUdashboardService', () => {
  let service: UsiUdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsiUdashboardService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsiUdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
