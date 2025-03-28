import { TestBed, getTestBed } from '@angular/core/testing';

import { SiExportSettingService } from './si-export-setting.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SiExportSettingService', () => {
  let service: SiExportSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.si_api_url;
  const workspace_id = 1;

  beforeEach(() => {
    localStorage.setItem('workspaceId', '1');
    TestBed.configureTestingModule({
    imports: [],
    providers: [SiExportSettingService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    service = TestBed.inject(SiExportSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
