import { TestBed } from '@angular/core/testing';
import { UsiUexportUlogService } from './si-export-log.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUexportUlogService', () => {
  let service: UsiUexportUlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsiUexportUlogService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsiUexportUlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
