import { TestBed } from '@angular/core/testing';
import { Usage50UmappingService } from './sage50-mapping.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Usage50UmappingService', () => {
  let service: Usage50UmappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Usage50UmappingService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Usage50UmappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
