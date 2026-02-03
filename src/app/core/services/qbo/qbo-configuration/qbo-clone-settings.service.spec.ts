import { TestBed } from '@angular/core/testing';
import { QboCloneSettingsService } from './qbo-clone-settings.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QboCloneSettingsService', () => {
  let service: QboCloneSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QboCloneSettingsService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QboCloneSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
