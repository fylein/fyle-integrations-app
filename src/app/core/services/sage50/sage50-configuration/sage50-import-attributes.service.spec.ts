import { TestBed } from '@angular/core/testing';
import { Sage50ImportAttributesService } from './sage50-import-attributes.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Sage50ImportAttributesService', () => {
  let service: Sage50ImportAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Sage50ImportAttributesService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Sage50ImportAttributesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
