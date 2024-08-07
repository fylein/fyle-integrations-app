import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QBOConnectorModel, QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qbo-onboarding-landing',
  templateUrl: './qbo-onboarding-landing.component.html',
  styleUrls: ['./qbo-onboarding-landing.component.scss']
})
export class QboOnboardingLandingComponent implements OnInit, OnDestroy {

  appName: AppName = AppName.QBO;

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.topLevelArticles.QBO;

  embedVideoLink = brandingDemoVideoLinks.onboarding.QBO;

  isIncorrectQBOConnectedDialogVisible: boolean = false;

  qboConnectionInProgress = false;

  private oauthCallbackSubscription: Subscription;

  readonly brandingContent = brandingContent.landing;

  constructor(
    private helperService: HelperService,
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isIncorrectQBOConnectedDialogVisible = false;
    if (data.hasAccepted) {
      this.router.navigate([`/integrations/qbo/onboarding/landing`]);
    }
  }

  connectQbo(): void {
    this.qboConnectionInProgress = true;
    const url = `${environment.qbo_authorize_uri}?client_id=${environment.qbo_oauth_client_id}&scope=com.intuit.quickbooks.accounting&response_type=code&redirect_uri=${environment.qbo_oauth_redirect_uri}&state=qbo_local_redirect`;

    this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1].split('&')[0];
      const realmId = callbackURL.split('realmId=')[1].split('&')[0];
      this.checkProgressAndRedirect(code, realmId);
    });

    this.helperService.oauthHandler(url);
  }

  private postQboCredentials(code: string, realmId: string): void {
    const payload: QBOConnectorPost = QBOConnectorModel.constructPayload(code, realmId);

    this.qboConnectorService.connectQBO(payload).subscribe((qboCredential: QBOCredential) => {
      this.qboConnectionInProgress = false;
      this.router.navigate([`/integrations/qbo/main/dashboard`]);
    }, (error) => {
      this.qboConnectionInProgress = false;
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct QuickBooks Online account') {
        this.isIncorrectQBOConnectedDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Something went wrong, please try again.');
        this.router.navigate([`/integrations/qbo/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(code: string, realmId: string): void {
    const onboardingState: QBOOnboardingState = this.workspaceService.getOnboardingState();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code,
        realmId
      }
    };

    if (onboardingState !== QBOOnboardingState.COMPLETE) {
      this.qboConnectionInProgress = false;
      this.router.navigate(['integrations/qbo/onboarding/connector'], navigationExtras);
    } else {
      this.postQboCredentials(code, realmId);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }
  }

}
