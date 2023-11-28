import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { QbdAuthService } from 'src/app/core/services/qbd/qbd-core/qbd-auth.service';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { environment } from 'src/environments/environment';
import { Sage300AuthService } from 'src/app/core/services/sage300/sage300-core/sage300-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private qbdAuthService: QbdAuthService,
    private siAuthService : SiAuthService,
    private sage300AuthService: Sage300AuthService
  ) { }

  private redirect(redirectUri: string | undefined): void {
    if (redirectUri) {
      this.router.navigate([redirectUri]);
    } else {
      this.router.navigate(['/integrations']);
    }
  }

  private saveUserProfileAndNavigate(code: string, redirectUri: string | undefined): void {
    this.authService.login(code).subscribe(response => {
      const user: MinimalUser = {
        'email': response.user.email,
        'access_token': response.access_token,
        'refresh_token': response.refresh_token,
        'full_name': response.user.full_name,
        'user_id': response.user.user_id,
        'org_id': response.user.org_id,
        'org_name': response.user.org_name
      };
      this.userService.storeUserProfile(user);
      this.qbdAuthService.qbdLogin(user.refresh_token).subscribe();

      // Only local dev needs this, login happens via postMessage for prod/staging through webapp
      if (!environment.production) {
        this.userService.storeUserProfile(user, 'si.user');
        this.siAuthService.loginWithRefreshToken(user.refresh_token).subscribe();
        this.sage300AuthService.loginWithRefreshToken(user.refresh_token).subscribe();
        this.redirect(redirectUri);
      } else {
        this.redirect(redirectUri);
      }
    });
  }

  private login(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.saveUserProfileAndNavigate(params.code, params.redirect_uri);
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();
    this.login();
  }

}
