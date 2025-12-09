import { TestBed } from '@angular/core/testing';
import { UcloneUsettingsService } from './clone-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UcloneUsettingsService', () => {
  let service: UcloneUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UcloneUsettingsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UcloneUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
