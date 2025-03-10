import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MinimalUser } from '../../models/db/user.model';
import { ClusterDomainWithToken, Token } from '../../models/misc/token.model';
import { UserService } from '../misc/user.service';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { IframeOrigin, IntegrationAppKey } from '../../models/enum/enum.model';
import { IntegrationTokensMap, Tokens } from '../../models/misc/integration-tokens-map';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { IframeOriginStorageService } from '../misc/iframe-origin-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private userService: UserService,
    private iframeOriginStorageService: IframeOriginStorageService
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

  storeTokens(appKey: IntegrationAppKey, tokens: Tokens) {
    let integrationTokens: IntegrationTokensMap | undefined = this.storageService.get('integration-tokens');
    if (integrationTokens) {
      integrationTokens[appKey] = tokens;
    } else {
      integrationTokens = {[appKey]: tokens};
    }

    this.storageService.set('integration-tokens', integrationTokens);
  }

  private getTokens(appKey: IntegrationAppKey) {
    const integrationTokens: IntegrationTokensMap | undefined = this.storageService.get('integration-tokens');
    return integrationTokens?.[appKey];
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

  /**
   * Update the access token and refresh token in the `user` object
   * These tokens will be used in all further requests by [JwtInterceptor](../../interceptor/jwt.interceptor.ts)
   * @param appKey
   */
  updateUserTokens(appKey: IntegrationAppKey) {
    if (
      !brandingFeatureConfig.loginToAllConnectedApps ||
      this.iframeOriginStorageService.get() !== IframeOrigin.ADMIN_DASHBOARD
    ) {
      return;
    }

    const user: MinimalUser | null = this.userService.getUserProfile();
    const tokens = this.getTokens(appKey);

    if (user && tokens) {
      user.refresh_token = tokens.refresh_token;
      user.access_token = tokens.access_token;
    } else {
      return;
    }

    this.userService.storeUserProfile(user);
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
