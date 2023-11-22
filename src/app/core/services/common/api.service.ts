import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

let API_BASE_URL = environment.api_url;

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

  private handleError(error: HttpErrorResponse, httpMethod: string) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, method was: ${httpMethod}, body was: ${JSON.stringify(error.error)} url was ${JSON.stringify(error)}`
      );
    }
    return throwError(error);
  }

  post(endpoint: string, body: {}): Observable<any> {
    console.log("post Api base url", API_BASE_URL);
    console.log("post endpoint", endpoint);
    console.log("post body", body);
    console.log("post Ahttpoptions", httpOptions);
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

  delete(endpoint: string, body: {}): Observable<any> {
    httpOptions.body = body;
    return this.http.delete(API_BASE_URL + endpoint, httpOptions).pipe(catchError(error => {
      return this.handleError(error, 'DELETE');
    }));
  }
}
