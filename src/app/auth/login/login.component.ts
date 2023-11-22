import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { QbdAuthService } from 'src/app/core/services/qbd/qbd-core/qbd-auth.service';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { EXPOSE_INTACCT_NEW_APP } from 'src/app/core/services/common/events.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
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
    private storageService: StorageService,
    private userService: UserService,
    private qbdAuthService: QbdAuthService,
    private siAuthService: SiAuthService,
    private sage300AuthService: Sage300AuthService
  ) { }

  private saveUserProfileAndNavigate(code: string): void {
    console.log("save User profile 1");
    this.authService.login(code).subscribe(response => {
      console.log('login authservice 2');
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
      this.qbdAuthService.qbdLogin(user.refresh_token).subscribe(() => {
        console.log('qbd service 3');
      });

      // Only local dev needs this, login happens via postMessage for prod/staging through webapp
      if (!environment.production) {
        this.siAuthService.loginWithRefreshToken(user.refresh_token).subscribe(() => {
          console.log('Si service 4');
        });
        this.sage300AuthService.loginWithRefreshToken(user.refresh_token).subscribe(() => {
          console.log('sag300 service 5');
        });
      }
      this.router.navigate(['/integrations']);
    });
  }

  private login(): void {
    this.route.queryParams.subscribe(params => {
      console.log("start 1", params);
      if (params.code) {
        console.log("start 2");
        this.saveUserProfileAndNavigate(params.code);
        console.log("start 3");
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();
    this.login();
  }

}
