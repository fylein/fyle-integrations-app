import { TestBed } from '@angular/core/testing';
import { ExportLogService } from './si-export-log.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ExportLogService', () => {
  let service: ExportLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportLogService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
