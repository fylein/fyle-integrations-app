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
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // Raise error only for non GET requests and 5xx errors (incase of GET)
      let raiseError: boolean = false;
      if (httpMethod !== 'GET') {
        raiseError = true;
      } else if (error.status >= 500) {
        raiseError = true;
      }

      if (raiseError) {
        console.error(
          `Backend returned code ${error.status}, url was: ${url} method was: ${httpMethod}, body was: ${JSON.stringify(error.error)}`
        );
      }
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
