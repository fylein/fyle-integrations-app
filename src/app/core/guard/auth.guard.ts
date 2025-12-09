import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/common/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }
}
