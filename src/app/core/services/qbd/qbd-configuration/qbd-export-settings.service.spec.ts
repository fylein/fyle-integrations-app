import { TestBed } from '@angular/core/testing';
import { UqbdUexportUsettingsService } from './qbd-export-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UqbdUexportUsettingsService', () => {
  let service: UqbdUexportUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UqbdUexportUsettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UqbdUexportUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
