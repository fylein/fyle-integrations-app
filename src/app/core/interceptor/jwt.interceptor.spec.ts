import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClient, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/common/api.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/common/auth.service';
import { tokenResponse, loginResponse, dummyErrorResponse } from './jwt.fixture';

xdescribe('JwtInterceptor', () => {
  let client: HttpClient;
  let controller: HttpTestingController;
  let service: ApiService;
  let injector: TestBed;
  let interceptor: JwtInterceptor;
  let authService: AuthService;
  let jwtHelperService: JwtHelperService;
  const API_BASE_URL = environment.api_url;

  beforeEach(() => {
    const service1 = {
      updateAccessToken: () => 'fyle',
      logout: () => undefined,
      refreshAccessToken: () => of(tokenResponse),
      getRefreshToken: () => 'fyle',
      getAccessToken: () => of('fyle')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService, JwtHelperService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        {
          provide: JWT_OPTIONS,
          useValue: JWT_OPTIONS
        },
        {
          provide: AuthService,
          useValue: service1
        },
        JwtInterceptor,
        JwtHelperService
      ]
    });

    injector = getTestBed();
    client = TestBed.inject(HttpClient);
    service = injector.inject(ApiService);
    authService = injector.inject(AuthService);
    jwtHelperService = injector.inject(JwtHelperService);
    controller = injector.inject(HttpTestingController);
    interceptor = TestBed.inject(JwtInterceptor);
  });


  it('should create the interceptor', inject([AuthService], (service: AuthService) => {
    const next: any = {
      handle: () => {
        return Observable.create((subscriber: { complete: () => void; }) => {
          subscriber.complete();
        });
      }
    };

    const requestMock = new HttpRequest('GET', '/test');
    interceptor.intercept(requestMock, next).subscribe();

    expect(interceptor).toBeDefined();
  }));

  it('should refresh access token', inject([AuthService], (service: AuthService) => {
    spyOn(authService, 'refreshAccessToken').and.returnValue(of(loginResponse));

    const next: any = {
      handle: () => {
        return Observable.create((subscriber: { complete: () => void; }) => {
          subscriber.complete();
        });
      }
    };

    const requestMock = new HttpRequest('GET', '/dummy');
    interceptor.intercept(requestMock, next).subscribe();

    expect(interceptor).toBeDefined();
    expect(authService.refreshAccessToken).toHaveBeenCalled();
  }));

  it('should activate the interceptor', inject([AuthService], (service: AuthService) => {
    const next: any = {
      handle: () => {
        return Observable.create((subscriber: { complete: () => void; }) => {
          subscriber.complete();
        });
      }
    };

    const requestMock = new HttpRequest('GET', `${API_BASE_URL}/api/auth/`);
    let response;
    interceptor.intercept(requestMock, next).subscribe((res) => {
      response = res;
    });
    expect(interceptor).toBeDefined();
  }));

  it('should return true for protected endpoint', () => {
    expect((interceptor as any).isTokenMandatory(`${API_BASE_URL}/integrations/`)).toBeTrue();
  });

  it('should call getRefreshToken', () => {
    spyOn(authService, 'getRefreshToken').and.returnValue(null);
    expect((interceptor as any).getAccessToken('user')).toBeDefined();
    expect(authService.getRefreshToken).toHaveBeenCalled();
  });

  it('should return true if a token is expiring / expired', () => {
    expect((interceptor as any).isTokenExpiring()).toBeTrue();
    expect((interceptor as any).isTokenExpiring('fyle')).toBeTrue();
  });

  it('should handle error', () => {
    expect((interceptor as any).handleError(dummyErrorResponse)).toBeDefined();
  });

  it('should allow API calls to be made for live token', () => {
    const dummyAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    spyOn(authService, 'getAccessToken').and.returnValue(dummyAccessToken);
    spyOn((interceptor as any), 'isTokenExpiring').and.returnValue(false);

    expect((interceptor as any).getAccessToken('user')).toBeDefined();
  });

  it('should check for expiry date', () => {
    spyOn((jwtHelperService), 'getTokenExpirationDate').and.returnValue(new Date());

    expect((interceptor as any).isTokenExpiring()).toBeDefined();
  });
});
