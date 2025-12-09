import { TestBed } from '@angular/core/testing';
import { Sage50MappingService } from './sage50-mapping.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Sage50MappingService', () => {
  let service: Sage50MappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Sage50MappingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(Sage50MappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
