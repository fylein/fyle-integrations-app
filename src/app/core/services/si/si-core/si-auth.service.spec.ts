import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Token } from 'src/app/core/models/misc/token.model';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { SiAuthService } from './si-auth.service';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SiAuthService', () => {
  let service: SiAuthService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.si_api_url;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SiAuthService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    injector = getTestBed();
    service = TestBed.inject(SiAuthService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('siLogin auth service test', () => {
    const siLoginResponse = {
      access_token: 'yyyyyy',
      expires_in: 3600,
      refresh_token: 'yyyyyyyyyy',
      token_type: 'User',
      user: {
        active: true,
        admin: false,
        email: 'anishkumar.s@fylehq.com',
        full_name: 'Anish K',
        id: 3,
        last_login: null,
        org_id: 'or79Cob97KSh',
        org_name: 'Test - AU',
        password: '',
        staff: false,
        user_id: '5Ga9HC3qctus',
      },
    };
    service.loginWithRefreshToken('eeeee').subscribe((value) => {
      const responseKeys = Object.keys(siLoginResponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/auth/login_with_refresh_token/`,
    });
    req.flush(siLoginResponse);
  });
});
