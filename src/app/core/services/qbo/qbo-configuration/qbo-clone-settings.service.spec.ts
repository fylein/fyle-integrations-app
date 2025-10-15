import { TestBed } from '@angular/core/testing';
import { UqboUcloneUsettingsService } from './qbo-clone-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UqboUcloneUsettingsService', () => {
  let service: UqboUcloneUsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UqboUcloneUsettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UqboUcloneUsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
