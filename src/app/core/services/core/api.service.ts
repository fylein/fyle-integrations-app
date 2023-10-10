import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

let API_BASE_URL = environment.api_url;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  setBaseApiURL(url: string) {
    API_BASE_URL = url
    console.log(API_BASE_URL)
  }

  private handleError(error: HttpErrorResponse, httpMethod: string) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, method was: ${httpMethod}, body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(error);
  }

  post(endpoint: string, body: {}): Observable<any> {
    return this.http.post(API_BASE_URL + endpoint, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'POST');
    }));
  }

  get(endpoint: string, apiParams: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(apiParams).forEach(key => {
      params = params.set(key, apiParams[key]);
    });

    return this.http.get(API_BASE_URL + endpoint, { params }).pipe(catchError(error => {
      return this.handleError(error, 'GET');
    }));
  }

  patch(endpoint: string, body: {}): Observable<any> {
    return this.http.patch(API_BASE_URL + endpoint, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'PATCH');
    }));
  }

  put(endpoint: string, body: {}): Observable<any> {
    return this.http.put(API_BASE_URL + endpoint, body, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'PUT');
    }));
  }
}
