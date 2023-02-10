import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from 'src/app/core/models/misc/token.model';
import { QbdApiService } from './qbd-api.service';

@Injectable({
  providedIn: 'root'
})
export class QbdAuthService {

  constructor(
    private apiService: QbdApiService
  ) { }

  qbdLogin(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refresh_token });
  }
}
