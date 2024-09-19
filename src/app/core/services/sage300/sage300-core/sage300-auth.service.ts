import { Injectable } from '@angular/core';
import type { ApiService } from '../../common/api.service';
import type { HelperService } from '../../common/helper.service';
import type { Observable } from 'rxjs/internal/Observable';
import type { Token } from 'src/app/core/models/misc/token.model';
import { AppUrl } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class Sage300AuthService {

  constructor(
    private apiService: ApiService,
    helper: HelperService
  ) {
    helper.setBaseApiURL(AppUrl.SAGE300);
  }

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }
}
