import { Inject, Injectable } from '@angular/core';
import type { Router } from '@angular/router';
import type { AuthService } from '../services/common/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth']);
      return false;
    }

    return true;
  }

}
