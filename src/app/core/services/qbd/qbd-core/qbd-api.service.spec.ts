import { HttpErrorResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { QbdApiService } from './qbd-api.service';

describe('QbdApiService', () => {
  let service: QbdApiService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const error = {
    status: 400,
    statusText: 'Bad request'
  };

  const API_BASE_URL = environment.qbd_api_url;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QbdApiService
      ]
    });
    injector = getTestBed();
    service = injector.inject(QbdApiService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should do a get call', () => {
    service.get('/org/', {id: 'xyz'}).subscribe(value => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/org/?id=xyz`
    });

    req.flush({});

    service.get('/org/', {}).subscribe(value => {
      expect(value).toEqual({});
    }, (err) => {
      expect(err.status).toBe(400);
    });

    const failedReq = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/org/`
    });

    failedReq.flush(null, error);
  });

  it('should do a post call', () => {
    service.post('/org/', {}).subscribe(value => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/org/`
    });

    req.flush({});

    service.post('/org/', {}).subscribe(value => {
      expect(value).toEqual({});
    }, (err) => {
      expect(err.status).toBe(400);
    });

    const failedReq = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/org/`
    });

    failedReq.flush(null, error);
  });

  it('should do a patch call', () => {
    service.patch('/org/', {}).subscribe(value => {
      expect(value).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/org/`
    });

    req.flush({});

    service.patch('/org/', {}).subscribe(value => {
      expect(value).toEqual({});
    }, (err) => {
      expect(err.status).toBe(400);
    });

    const failedReq = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/org/`
    });

    failedReq.flush(null, error);
  });

  it('should handle error', () => {
    const errors = new ErrorEvent('Some Error XYZ', { message: 'Bad request', error: new Error('Error')});

    const response: HttpErrorResponse = {
      error: errors,
      status: 400,
      statusText: 'Bad request',
      name: 'HttpErrorResponse',
      message: '',
      ok: false,
      headers: new HttpHeaders,
      url: null,
      type: HttpEventType.ResponseHeader
    };

    const error = (service as any).handleError(response, 'GET');
    expect(response.error.message).toEqual('Bad request');
    expect(error).toBeInstanceOf(Observable);
  });
});
