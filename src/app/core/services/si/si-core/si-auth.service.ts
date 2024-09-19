import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Token } from 'src/app/core/models/misc/token.model';
import type { ApiService } from '../../common/api.service';
import type { HelperService } from '../../common/helper.service';
import { AppUrl } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class SiAuthService {

  constructor(
    private apiService: ApiService,
    private helperService: HelperService
  ) {
    this.helperService.setBaseApiURL(AppUrl.INTACCT);
  }

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }

  loginWithAuthCode(code: string): Observable<Token> {
    this.helperService.setBaseApiURL(AppUrl.INTACCT);
    return this.apiService.post('/auth/login/', { code });
  }

  refreshAccessToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/refresh/', { refresh_token: refreshToken });
  }
}
