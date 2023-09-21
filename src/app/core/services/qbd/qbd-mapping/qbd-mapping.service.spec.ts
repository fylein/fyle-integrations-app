import { TestBed, getTestBed } from '@angular/core/testing';

import { QbdMappingService } from './qbd-mapping.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('QbdMappingService', () => {
  let service: QbdMappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;
  const workspace_id = 1;

  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QbdMappingService]
    });
    injector = getTestBed();
    service = TestBed.inject(QbdMappingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
