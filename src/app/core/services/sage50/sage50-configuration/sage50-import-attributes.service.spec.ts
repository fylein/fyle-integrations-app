import { TestBed } from '@angular/core/testing';
import { Usage50UimportUattributesService } from './sage50-import-attributes.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Usage50UimportUattributesService', () => {
  let service: Usage50UimportUattributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Usage50UimportUattributesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Usage50UimportUattributesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
