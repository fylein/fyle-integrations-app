import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (req.method === 'POST') {
          if (error.status >= 500) {
            console.error(`POST error ${error.status}: ${error.message}`);
          }
        } else if (req.method === 'GET') {
          if (error.status !== 404) {
            console.error(`GET error ${error.status}: ${error.message}`);
          }
          // Else (404 GET error) - do not log
        } else {
          // For other HTTP methods, you can add custom logic or just log the errors
          console.error(`HTTP ${req.method} error ${error.status}: ${error.message}`);
        }

        // Return a default value or rethrow the error
        return throwError(() => new Error('Error occurred; error details processed.'));
      })
    );
  }
}
