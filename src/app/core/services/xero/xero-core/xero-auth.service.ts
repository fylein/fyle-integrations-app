import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XeroAuthService {

  constructor(
    private apiService: ApiService
  ) { }

  loginWithRefreshToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refreshToken });
  }

  login(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code: code });
  }
}
