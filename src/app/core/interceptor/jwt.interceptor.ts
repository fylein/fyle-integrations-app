import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/misc/token.model';
import { AuthService } from '../services/common/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private jwtHelpter: JwtHelperService,
  ) {}

  private refreshTokenInProgress = false;

  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isTokenMandatory(request.url)) {
      return this.getAccessToken(request.url).pipe(
        switchMap((accessToken) => {
          if (!accessToken) {
            return this.handleError({ status: 401, error: 'Unauthorized' } as HttpErrorResponse);
          }
          return this.executeHttpRequest(request, next, accessToken);
        }),
      );
    }

    request = request.clone({ url: request.url });
    return next.handle(request);
  }

  // Certain api's do not require token in headers.
  private isTokenMandatory(url: string): boolean {
    const endpointWithoutToken =
      url.includes('/api/auth/') || url.includes('/travelperk/connect') || url.includes('amazonaws.com');
    return !endpointWithoutToken;
  }

  private executeHttpRequest(request: HttpRequest<any>, next: HttpHandler, accessToken: string) {
    request = request.clone({
      url: request.url,
      headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
    });
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  /**
   * This method get current accessToken from Storage, check if this token is expiring or not.
   * If the token is expiring it will get another accessToken from API and return the new accessToken
   * If multiple API call initiated then `this.refreshTokenInProgress` will block multiple access_token call
   * Reference: https://stackoverflow.com/a/57638101
   */
  private getAccessToken(url: string): Observable<string | null> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken && !this.isTokenExpiring(accessToken)) {
      return of(accessToken);
    }

    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);
      return this.refreshAccessToken(url).pipe(
        switchMap((newAccessToken) => {
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(newAccessToken);
          return of(newAccessToken);
        }),
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((result) => result !== null),
      take(1),
      map(() => this.authService.getAccessToken()),
    );
  }

  private isTokenExpiring(accessToken: string): boolean {
    try {
      const expiryDate = this.jwtHelpter.getTokenExpirationDate(accessToken);
      const now = new Date().toISOString();
      const isoExpiredDate = expiryDate ? expiryDate.toISOString() : now;

      const differenceSeconds = new Date(isoExpiredDate).valueOf() - new Date(now).valueOf();
      const maxRefreshDifferenceSeconds = 2 * 60;

      return differenceSeconds < maxRefreshDifferenceSeconds;
    } catch (err) {
      return true;
    }
  }

  private refreshAccessToken(url: string): Observable<string | null> {
    const refreshToken = this.authService.getRefreshToken();

    if (refreshToken) {
      return this.authService.refreshAccessToken(refreshToken).pipe(
        catchError((error) => this.handleError(error)),
        map((token: Token) => this.authService.updateAccessToken(token.access_token)),
      );
    }

    return of(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }
}
