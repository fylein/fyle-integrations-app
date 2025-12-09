import { TestBed } from '@angular/core/testing';
import { UcsvUjsonUtranslatorService } from './csv-json-translator.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UcsvUjsonUtranslatorService', () => {
  let service: UcsvUjsonUtranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UcsvUjsonUtranslatorService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UcsvUjsonUtranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
