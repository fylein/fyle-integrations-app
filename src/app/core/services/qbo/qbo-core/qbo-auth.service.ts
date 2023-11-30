import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../common/api.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { HelperService } from '../../common/helper.service';
import { AppUrl } from 'src/app/core/models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class QboAuthService {

  constructor(
    private apiService: ApiService
  ) {}

  loginWithRefreshToken(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }
}
