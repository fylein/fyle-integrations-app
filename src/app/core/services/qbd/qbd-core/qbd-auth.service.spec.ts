import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Token } from 'src/app/core/models/misc/token.model';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { QbdAuthService } from './qbd-auth.service';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('QbdAuthService', () => {
  let service: QbdAuthService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.qbd_api_url;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [QbdAuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    injector = getTestBed();
    service = TestBed.inject(QbdAuthService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('qbdLogin auth service test', () => {
    const qbdLoginResponse = {
      access_token: 'yyyyyy',
      expires_in: 3600,
      refresh_token: 'yyyyyyyyyy',
      token_type: 'Bearer',
      user: {
        active: true,
        admin: false,
        email: 'sravan.kumar@fyle.in',
        full_name: 'sravan k',
        id: 3,
        last_login: null,
        org_id: 'orunxXsIajSE',
        org_name: 'Test Sample Statement - GBP',
        password: '',
        staff: false,
        user_id: 'ust5Ga9HC3qc',
      },
    };
    service.qbdLogin('eeeee').subscribe((value) => {
      const responseKeys = Object.keys(qbdLoginResponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/auth/login_with_refresh_token/`,
    });
    req.flush(qbdLoginResponse);
  });
});
