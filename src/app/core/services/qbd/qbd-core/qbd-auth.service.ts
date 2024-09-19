import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Token } from 'src/app/core/models/misc/token.model';
import type { ApiService } from '../../common/api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdAuthService {

  constructor(
    private apiService: ApiService
  ) { }

  qbdLogin(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refresh_token });
  }
}
