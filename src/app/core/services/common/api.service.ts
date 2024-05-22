import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';

let API_BASE_URL: string;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  body: {}
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  setBaseApiURL(url: string): void {
    API_BASE_URL = url;
  }

  private handleError(error: HttpErrorResponse, httpMethod: string, url: string) {
    if (httpMethod === 'POST') {
      if (error.status >= 500) {
        console.error(`POST error ${error.status}: ${error.message}`);
      }
    } else if (httpMethod === 'GET') {
      if (error.status !== 404) {
        console.error(`GET error ${error.status}: ${error.message}`);
      }
      // Else (404 GET error) - do not log
    } else {
      // For other HTTP methods, you can add custom logic or just log the errors
      console.error(`HTTP ${httpMethod} error ${error.status}: ${error.message}`);
    }
    return throwError(error);
  }

  post(endpoint: string, body: {}): Observable<any> {
    const url = API_BASE_URL + endpoint;
    return this.http.post(url, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'POST', url);
    }));
  }

  get(endpoint: string, apiParams: any, apiBaseUrl?: string): Observable<any> {
    let params = new HttpParams();
    Object.keys(apiParams).forEach(key => {
      params = params.set(key, apiParams[key]);
    });
    const url = (apiBaseUrl ? apiBaseUrl : API_BASE_URL) + endpoint;
    return this.http.get(url, { params }).pipe(catchError(error => {
      return this.handleError(error, 'GET', url);
    }));
  }

  patch(endpoint: string, body: {}): Observable<any> {
    const url = API_BASE_URL + endpoint;
    return this.http.patch(url, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'PATCH', url);
    }));
  }

  put(endpoint: string, body: {}): Observable<any> {
    const url = API_BASE_URL + endpoint;
    return this.http.put(url, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'PUT', url);
    }));
  }

  delete(endpoint: string, body: {}): Observable<any> {
    httpOptions.body = body;
    const url = API_BASE_URL + endpoint;
    return this.http.delete(url, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'DELETE', url);
    }));
  }
}
