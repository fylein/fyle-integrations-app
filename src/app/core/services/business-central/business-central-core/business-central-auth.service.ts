import { Injectable } from '@angular/core';
import { ApiService } from '../../common/api.service';
import { HelperService } from '../../common/helper.service';
import { Observable } from 'rxjs';
import { Token } from 'src/app/core/models/misc/token.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessCentralAuthService {

  constructor(
    private apiService: ApiService,
    helper: HelperService
  ) {
    helper.setBaseApiURL();
  }

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }
}
