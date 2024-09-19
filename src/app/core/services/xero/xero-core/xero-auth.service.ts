import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { Token } from 'src/app/core/models/misc/token.model';
import type { Observable } from 'rxjs';
import type { HelperService } from '../../common/helper.service';
import { AppUrl } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class XeroAuthService {

  constructor(
    private apiService: ApiService,
    private helperService: HelperService
  ) { }

  loginWithRefreshToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refreshToken });
  }

  login(code: string): Observable<Token> {
    this.helperService.setBaseApiURL(AppUrl.XERO);
    return this.apiService.post('/auth/login/', { code: code });
  }
}
