import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { QbdAuthService } from 'src/app/core/services/qbd/qbd-core/qbd-auth.service';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { environment } from 'src/environments/environment';
import { Sage300AuthService } from 'src/app/core/services/sage300/sage300-core/sage300-auth.service';
import { BusinessCentralAuthService } from 'src/app/core/services/business-central/business-central-core/business-central-auth.service';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { AppUrl } from 'src/app/core/models/enum/enum.model';
import { ClusterDomainWithToken } from 'src/app/core/models/misc/token.model';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { NetsuiteAuthService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-auth.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';
import { exposeAppConfig } from 'src/app/branding/expose-app-config';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly brandingConfig = brandingConfig;

  readonly isINCluster = this.storageService.get('cluster-domain')?.includes('in1');

  readonly exposeApps = !this.isINCluster ? exposeAppConfig[brandingConfig.brandId][brandingConfig.envId] : exposeAppConfig[brandingConfig.brandId]['production-1-in'];

  constructor(
    private authService: AuthService,
    private businessCentralAuthService: BusinessCentralAuthService,
    private helperService: HelperService,
    private qboAuthService: QboAuthService,
    private qbdAuthService: QbdAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sage300AuthService: Sage300AuthService,
    private siAuthService : SiAuthService,
    private netsuiteAuthService: NetsuiteAuthService,
    private xeroAuthService: XeroAuthService,
    private storageService: StorageService,
    private userService: UserService
  ) { }

  private redirect(redirectUri: string | undefined, code:string): void {
    if (redirectUri) {
      this.router.navigate([redirectUri + `?code=${code}`] );
      // eslint-disable-next-line no-console
      console.log('redirectUri', redirectUri + `?code=${code}`);
    } else {
      this.router.navigate(['/integrations']);
    }
  }

  private saveUserProfileAndNavigate(code: string, redirectUri: string | undefined): void {
    this.helperService.setBaseApiURL(AppUrl.INTEGRATION);
    this.authService.getClusterDomainByCode(code).subscribe((clusterDomainWithToken: ClusterDomainWithToken) => {
      this.storageService.set('cluster-domain', clusterDomainWithToken.cluster_domain);
      this.helperService.setBaseApiURL(AppUrl.INTEGRATION);
      this.authService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe(response => {
        const user: MinimalUser = {
          'email': response.user.email,
          'access_token': response.access_token,
          'refresh_token': clusterDomainWithToken.tokens.refresh_token,
          'full_name': response.user.full_name,
          'user_id': response.user.user_id,
          'org_id': response.user.org_id,
          'org_name': response.user.org_name
        };
        this.userService.storeUserProfile(user);

        if (this.exposeApps?.QBD) {
          this.helperService.setBaseApiURL(AppUrl.QBD);
          this.qbdAuthService.qbdLogin(clusterDomainWithToken.tokens.refresh_token).subscribe();
        }

        if (this.exposeApps?.SAGE300) {
          this.helperService.setBaseApiURL(AppUrl.SAGE300);
          this.sage300AuthService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe();
        }

        if (this.exposeApps?.BUSINESS_CENTRAL) {
          this.helperService.setBaseApiURL(AppUrl.BUSINESS_CENTRAL);
          this.businessCentralAuthService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe();
        }

        // Only local dev needs this, login happens via postMessage for prod/staging through webapp
        if (!environment.production) {
          this.userService.storeUserProfile(user);
          if (this.exposeApps?.QBO) {
            this.helperService.setBaseApiURL(AppUrl.QBO);
            this.qboAuthService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe();
          }
          if (this.exposeApps?.INTACCT) {
            this.helperService.setBaseApiURL(AppUrl.INTACCT);
            this.siAuthService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe();
          }
          if (this.exposeApps?.NETSUITE) {
            this.helperService.setBaseApiURL(AppUrl.NETSUITE);
            this.netsuiteAuthService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe();
          }
          if (this.exposeApps?.XERO) {
            this.helperService.setBaseApiURL(AppUrl.XERO);
            this.xeroAuthService.loginWithRefreshToken(clusterDomainWithToken.tokens.refresh_token).subscribe();
          }
          this.redirect(redirectUri, code);
        } else {
          this.redirect(redirectUri, code);
        }
      });
    });
  }

  private login(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        // eslint-disable-next-line no-console
        console.log('code', params.code);
        // eslint-disable-next-line no-console
        console.log('redirect_uri', params.redirect_uri);
        this.saveUserProfileAndNavigate(params.code, params.redirect_uri);
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();
    this.login();
  }

}
