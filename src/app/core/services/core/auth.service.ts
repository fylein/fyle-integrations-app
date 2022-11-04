import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MinimalUser } from '../../models/db/user.model';
import { Token } from '../../models/misc/token.model';
import { UserService } from '../misc/user.service';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

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
  }

  checkLoginStatusAndLogout(): void {
    if (this.isLoggedIn()) {
      this.logout();
    }
  }
}
