import { TestBed, getTestBed } from '@angular/core/testing';

import { CloneSettingService } from './clone-setting.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('CloneSettingService', () => {
  let service: CloneSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.cluster_domain_api_url;
  const workspace_id = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    injector = getTestBed();
    service = TestBed.inject(CloneSettingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
