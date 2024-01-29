import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from 'src/app/core/models/misc/token.model';
import { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class SiAuthService {

  constructor(
    private apiService: ApiService
  ) { }

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }

  loginWithAuthCode(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code });
  }

  refreshAccessToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/refresh/', { refresh_token: refreshToken });
  }
}
