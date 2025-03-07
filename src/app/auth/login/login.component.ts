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
import { AppUrl, IntegrationAppKey } from 'src/app/core/models/enum/enum.model';
import { ClusterDomainWithToken } from 'src/app/core/models/misc/token.model';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { NetsuiteAuthService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-auth.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';
import { exposeAppConfig } from 'src/app/branding/expose-app-config';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { QbdDirectAuthService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-auth.service';
import { EventsService } from 'src/app/core/services/common/events.service';
import { IntegrationsService } from 'src/app/core/services/common/integrations.service';
import { Tokens } from 'src/app/core/models/misc/integration-tokens-map';
import { appKeyToAccountingIntegrationApp, Integration, integrationCallbackUrlMap } from 'src/app/core/models/integrations/integrations.model';
import { RedirectUriStorageService } from 'src/app/core/services/misc/redirect-uri-storage.service';

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
    private qbdDirectAuthService: QbdDirectAuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sage300AuthService: Sage300AuthService,
    private siAuthService : SiAuthService,
    private netsuiteAuthService: NetsuiteAuthService,
    private xeroAuthService: XeroAuthService,
    private storageService: StorageService,
    private userService: UserService,
    private eventsService: EventsService,
    private integrationsService: IntegrationsService,
    private redirectUriStorageService: RedirectUriStorageService
  ) { }

  private redirect(redirectUri: string | undefined, code:string): void {
    console.log('[x] redirecting to', redirectUri);
    if (redirectUri) {
      brandingFeatureConfig.loginRedirectUri ? this.router.navigate([redirectUri], { queryParams: { code: code } }) : this.router.navigate([redirectUri]);
    } else {
      this.router.navigate(['/integrations']);
    }
  }

  /**
   * Logs in to all connected apps
   * @param integrations The list of connected integrations
   * @param integrationsAppTokens Refresh and access tokens of the integrations app
   * @returns Whether redirection will be performed by the postMessage listener
   */
  private loginToConnectedApps(integrations: Integration[], integrationsAppTokens: Tokens) {
    /**
     * We have 4 apps with unique TPA IDs: Netsuite, Intacct, QBO, and Xero.
     * We log in to all currently connected apps on page load, and store their tokens.
     * When an app is switched, we replace the tokens in localstorage > 'user' object
     * with the stored token of the current app. (also see AppComponent)
     */
    const connectedAppKeys = integrations.map(integration =>
      this.integrationsService.getIntegrationKey(integration.tpa_name)!
    );

    console.log({connectedAppKeys});
    const appsWithUniqueTpaIds: IntegrationAppKey[] = [
      "NETSUITE", "INTACCT", "QBO", "XERO"
    ];

    let deferRedirect = false;

    for (const appKey of connectedAppKeys) {
      if (appsWithUniqueTpaIds.includes(appKey)) {
        // If this app has a unique TPA ID, log in to it.
        // When fyle-app sends back tokens, store them in localstorage and redirect to the logged-in app.
        // (it is safe to assume only one such app can be connected at a time)
        const accountingIntegrationApp = appKeyToAccountingIntegrationApp[appKey]!;
        const payload = {
          callbackUrl: integrationCallbackUrlMap[accountingIntegrationApp][0],
          clientId: integrationCallbackUrlMap[accountingIntegrationApp][1]
        };

        console.log("[x] posting:", {payload});
        this.eventsService.postEvent(payload);

        // We will need to wait for new tokens from fyle-app before we can redirect.
        // Defer this redirection to the watcher in AppComponent
        deferRedirect = true;
      } else {
        // Otherwise, this app has the same TPA ID as the integrations app,
        // So we map this app to the tokens of integrations app.
        this.authService.storeTokens(appKey, integrationsAppTokens);
      }
    }

    return deferRedirect;
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

        if (this.exposeApps?.QBD_DIRECT) {
          this.helperService.setBaseApiURL(AppUrl.QBD_DIRECT);
          this.qbdDirectAuthService.login(clusterDomainWithToken.tokens.refresh_token).subscribe();
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
          // this.redirect(redirectUri, code);

          // TODO: remove this for local -
          const integrationsAppTokens = {
            refresh_token: clusterDomainWithToken.tokens.refresh_token,
            access_token: response.access_token
          };
          this.integrationsService.getIntegrations().subscribe((integrations) => {
            const deferRedirect = this.loginToConnectedApps(integrations, integrationsAppTokens);
            console.log('[x]', {deferRedirect});
            if (deferRedirect) {
              // This will later be used to redirect once login is done
              this.redirectUriStorageService.set(redirectUri);
            } else {
              this.redirect(redirectUri, code);
            }
          });

        } else {

          const integrationsAppTokens = {
            refresh_token: clusterDomainWithToken.tokens.refresh_token,
            access_token: response.access_token
          };
          this.integrationsService.getIntegrations().subscribe((integrations) => {
            const deferRedirect = this.loginToConnectedApps(integrations, integrationsAppTokens);
            console.log('[x]', {deferRedirect});
            if (deferRedirect) {
              // This will later be used to redirect once login is done
              this.redirectUriStorageService.set(redirectUri);
            } else {
              this.redirect(redirectUri, code);
            }
          });
        }
      });
    });
  }

  private login(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        if (params.redirect_uri) {
          this.eventsService.resetNavigationHistory(params.redirect_uri);
        }
        this.saveUserProfileAndNavigate(params.code, params.redirect_uri);
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();
    this.login();
  }

}
