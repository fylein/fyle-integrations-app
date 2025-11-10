import { TestBed } from '@angular/core/testing';
import { CsvJsonTranslatorService } from './csv-json-translator.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CsvJsonTranslatorService', () => {
  let service: CsvJsonTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CsvJsonTranslatorService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CsvJsonTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
