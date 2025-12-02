import { TestBed } from '@angular/core/testing';
import { CloneSettingsService } from './clone-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CloneSettingsService', () => {
  let service: CloneSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CloneSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CloneSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
