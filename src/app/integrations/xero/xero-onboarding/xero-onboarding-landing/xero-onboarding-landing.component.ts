import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { XeroCredentials } from 'src/app/core/models/xero/db/xero-credential.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { XeroConnectorService } from 'src/app/core/services/xero/xero-configuration/xero-connector.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-xero-onboarding-landing',
  templateUrl: './xero-onboarding-landing.component.html',
  styleUrls: ['./xero-onboarding-landing.component.scss']
})
export class XeroOnboardingLandingComponent implements OnInit, OnDestroy {

  isIncorrectXeroConnectedDialogVisible: boolean = false;

  appName: string = AppName.XERO;

  xeroConnectionInProgress: boolean = false;

  isIntegrationConnected: boolean = false;

  redirectLink: string = brandingKbArticles.onboardingArticles.XERO.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.XERO;

  private oauthCallbackSubscription: Subscription;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.xero.landing;

  constructor(
    private helperService: HelperService,
    private xeroConnectorService: XeroConnectorService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private xeroHelper: XeroHelperService,
    private toastService: IntegrationsToastService
  ) { }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isIncorrectXeroConnectedDialogVisible = false;
    if (data.hasAccepted) {
      this.router.navigate([`/integrations/xero/onboarding/landing`]);
    }
  }

  private postXeroCredentials(code: string): void {
    this.xeroConnectorService.connectXero(this.workspaceService.getWorkspaceId(), code).subscribe((xeroCredentials: XeroCredentials) => {
      this.isIntegrationConnected = true;
      this.xeroConnectionInProgress = false;
      this.checkProgressAndRedirect();
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Xero tenant. Please try again';
      if (errorMessage === 'Please choose the correct Xero account') {
        this.isIntegrationConnected = false;
        this.xeroConnectionInProgress = false;
        this.isIncorrectXeroConnectedDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/xero/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(): void {
    const onboardingState: XeroOnboardingState = this.workspaceService.getOnboardingState();
    if (onboardingState !== XeroOnboardingState.COMPLETE) {
      this.xeroConnectorService.postXeroTenants().subscribe(() => {
        this.workspaceService.setOnboardingState(XeroOnboardingState.TENANT_MAPPING);
        this.router.navigate(['integrations/xero/onboarding/connector']);
      });
    } else {
      this.router.navigate(['integrations/xero/main/dashboard']);
    }
  }

  connectXero() {
    this.xeroConnectionInProgress = true;
    const url = `${environment.xero_authorize_uri}?client_id=${environment.xero_oauth_client_id}&scope=${environment.xero_scope}&response_type=code&redirect_uri=${environment.xero_oauth_redirect_uri}&state=xero_local_redirect`;
    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1]?.split('&')[0];
      this.postXeroCredentials(code);
    });
    this.helperService.oauthHandler(url);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }
  }

}
