import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { BusinessCentralConnectorPost, BusinessCentralConnectorModel } from 'src/app/core/models/business-central/business-central-configuration/business-central-connector.model';
import { BusinessCentralCredential, BusinessCentralCompanyDetails } from 'src/app/core/models/business-central/db/business-central-credentials.model';
import { BusinessCentralOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralConnectorService } from 'src/app/core/services/business-central/business-central-configuration/business-central-connector.service';
import { BusinessCentralExportSettingsService } from 'src/app/core/services/business-central/business-central-configuration/business-central-export-settings.service';
import { BusinessCentralHelperService } from 'src/app/core/services/business-central/business-central-core/business-central-helper.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business-central-onboarding-landing',
  templateUrl: './business-central-onboarding-landing.component.html',
  styleUrls: ['./business-central-onboarding-landing.component.scss']
})
export class BusinessCentralOnboardingLandingComponent implements OnInit {
  redirectLink = brandingKbArticles.onboardingArticles.BUSINESS_CENTRAL.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.BUSINESS_CENTRAL;

  readonly brandingConfig = brandingConfig;

  businessCentralConnectionInProgress: boolean = false;

  isIntegrationConnected: boolean = false;

  private oauthCallbackSubscription: Subscription;

  isIncorrectQBOConnectedDialogVisible: boolean;

  constructor(
    private helperService: HelperService,
    private businessCentralConnectorService: BusinessCentralConnectorService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private businessCentralHelperService: BusinessCentralHelperService,
    private workspaceService: WorkspaceService
  ) { }

  acceptWarning(isWarningAccepted: boolean): void {
    this.isIncorrectQBOConnectedDialogVisible = false;
    if (isWarningAccepted) {
      this.router.navigate([`/integrations/qbo/onboarding/landing`]);
    }
  }

  connectBusinessCentral(): void {
    this.businessCentralConnectionInProgress = true;
    const url = `${environment.business_central_authorize_uri}?client_id=${environment.business_central_oauth_client_id}&scope=com.intuit.quickbooks.accounting&response_type=code&redirect_uri=${environment.business_central_oauth_redirect_uri}&state=business_central_local_redirect`;

    this.oauthCallbackSubscription = this.helperService.oauthCallbackUrl.subscribe((callbackURL: string) => {
      const code = callbackURL.split('code=')[1].split('&')[0];
      this.checkProgressAndRedirect(code);
    });

    this.helperService.oauthHandler(url);
  }

  private postBusinessCentralCredentials(code: string): void {
    const payload: BusinessCentralConnectorPost = BusinessCentralConnectorModel.constructPayload(code);

    this.businessCentralConnectorService.connectBusinessCentral(payload).subscribe(() => {
        this.businessCentralConnectionInProgress = false;
        this.isIntegrationConnected = true;
        this.router.navigate([`/integrations/business_central/main/dashboard`]);
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Dynamic 360 Business Central. Please try again';
      if (errorMessage === 'Please choose the correct Dynamic 360 Business Central account') {
        this.isIncorrectQBOConnectedDialogVisible = false;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integrations/business_central/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(code: string): void {
    const onboardingState: BusinessCentralOnboardingState = this.workspaceService.getOnboardingState();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code
      }
    };

    if (onboardingState !== BusinessCentralOnboardingState.COMPLETE) {
      this.router.navigate(['integrations/qbo/onboarding/connector'], navigationExtras);
    } else {
      this.postBusinessCentralCredentials(code);
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
