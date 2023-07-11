import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from 'src/app/core/models/misc/token.model';
import { SiApiService } from './si-api.service';

@Injectable({
  providedIn: 'root'
})
export class SiAuthService {

  constructor(
    private apiService: SiApiService
  ) { }

  siLogin(refresh_token: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token });
  }
}
