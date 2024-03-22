import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { Observable } from 'rxjs';
import { HelperService } from '../../common/helper.service';
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
