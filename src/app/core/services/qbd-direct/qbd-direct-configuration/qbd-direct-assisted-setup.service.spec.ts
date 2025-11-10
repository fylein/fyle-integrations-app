import { TestBed } from '@angular/core/testing';
import { QbdDirectAssistedSetupService } from './qbd-direct-assisted-setup.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QbdDirectAssistedSetupService', () => {
  let service: QbdDirectAssistedSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QbdDirectAssistedSetupService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QbdDirectAssistedSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
