import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { MinimalUser } from '../../models/db/user.model';
import type { ClusterDomainWithToken, Token } from '../../models/misc/token.model';
import type { UserService } from '../misc/user.service';
import type { ApiService } from './api.service';
import type { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private userService: UserService
  ) { }

  isLoggedIn(): boolean | null {
    return this.userService.getUserProfile() !== null;
  }

  login(code: string): Observable<Token> {
    return this.apiService.post('/auth/login/', { code: code });
  }

  getClusterDomainByCode(code: string): Observable<ClusterDomainWithToken> {
    return this.apiService.post('/auth/cluster_domain/', { code });
  }

  loginWithRefreshToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refreshToken });
  }

  getAccessToken(): string | null {
    const user: MinimalUser | null = this.userService.getUserProfile();

    return user ? user.access_token : null;
  }

  getRefreshToken(): string | null {
    const user: MinimalUser | null = this.userService.getUserProfile();

    return user ? user.refresh_token : null;
  }

  refreshAccessToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/refresh/', { refresh_token: refreshToken });
  }

  updateAccessToken(accessToken: string): string | null {
    const user: MinimalUser | null = this.userService.getUserProfile();

    if (user) {
      user.access_token = accessToken;
      this.userService.storeUserProfile(user);
      return accessToken;
    }

    return null;
  }

  logout(): void {
    this.storageService.remove('user');
    this.storageService.remove('cluster-domain');
  }

  checkLoginStatusAndLogout(): void {
    if (this.isLoggedIn()) {
      this.logout();
    }
  }
}
