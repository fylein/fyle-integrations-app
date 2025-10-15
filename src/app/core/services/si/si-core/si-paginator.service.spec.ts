import { TestBed } from '@angular/core/testing';
import { UsiUpaginatorService } from './si-paginator.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsiUpaginatorService', () => {
  let service: UsiUpaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsiUpaginatorService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UsiUpaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
