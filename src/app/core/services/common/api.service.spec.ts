import { getTestBed, TestBed } from '@angular/core/testing';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import {
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { Observable } from 'rxjs';

xdescribe('ApiService', () => {
  let service: ApiService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const error = {
    status: 400,
    statusText: 'Bad request',
  };

  const API_BASE_URL = environment.cluster_domain_api_url;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    injector = getTestBed();
    service = injector.inject(ApiService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do a get call', () => {
    service.get('/org/', { id: 'xyz' }).subscribe((value) => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/org/?id=xyz`,
    });

    req.flush({});

    service.get('/org/', {}).subscribe(
      (value) => {
        expect(value).toEqual({});
      },
      (err) => {
        expect(err.status).toBe(400);
      },
    );

    const failedReq = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/org/`,
    });

    failedReq.flush(null, error);
  });

  it('should do a post call', () => {
    service.post('/org/', {}).subscribe((value) => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/org/`,
    });

    req.flush({});

    service.post('/org/', {}).subscribe(
      (value) => {
        expect(value).toEqual({});
      },
      (err) => {
        expect(err.status).toBe(400);
      },
    );

    const failedReq = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/org/`,
    });

    failedReq.flush(null, error);
  });

  it('should do a patch call', () => {
    service.patch('/org/', {}).subscribe((value) => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/org/`,
    });

    req.flush({});

    service.patch('/org/', {}).subscribe(
      (value) => {
        expect(value).toEqual({});
      },
      (err) => {
        expect(err.status).toBe(400);
      },
    );

    const failedReq = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/org/`,
    });

    failedReq.flush(null, error);
  });

  it('should handle error', () => {
    const errors = new ErrorEvent('Some Error XYZ', { message: 'Bad request', error: new Error('Error') });

    const response: HttpErrorResponse = {
      error: errors,
      status: 400,
      statusText: 'Bad request',
      name: 'HttpErrorResponse',
      message: '',
      ok: false,
      headers: new HttpHeaders(),
      url: null,
      type: HttpEventType.ResponseHeader,
    };

    const error = (service as any).handleError(response, 'GET');
    expect(response.error.message).toEqual('Bad request');
    expect(error).toBeInstanceOf(Observable);
  });
});
