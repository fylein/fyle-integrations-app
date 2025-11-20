import { TestBed } from '@angular/core/testing';
import { PaginatorService } from './si-paginator.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PaginatorService', () => {
  let service: PaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaginatorService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
