import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { XeroCredentials } from 'src/app/core/models/xero/db/xero-credential.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { XeroConnectorService } from 'src/app/core/services/xero/xero-configuration/xero-connector.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { environment } from 'src/environments/environment';
import { TranslocoService } from '@jsverse/transloco';

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

  private destroy$ = new Subject<void>();

  constructor(
    private helperService: HelperService,
    private xeroConnectorService: XeroConnectorService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private xeroHelper: XeroHelperService,
    private toastService: IntegrationsToastService,
    private xeroAuthService: XeroAuthService,
    private translocoService: TranslocoService
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
      const errorMessage = 'message' in error.error ? error.error.message : this.translocoService.translate('xeroOnboardingLanding.connectionFailedMessage');
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
    this.xeroAuthService.connectXero();
  }

  ngOnInit(): void {
    this.xeroAuthService.xeroConnectionInProgress$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
      this.xeroConnectionInProgress = status;
    });

    this.xeroAuthService.isIncorrectAccountSelected$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
      this.isIncorrectXeroConnectedDialogVisible = status;
    });

    this.xeroAuthService.isIntegrationConnected$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
      this.isIntegrationConnected = status;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.oauthCallbackSubscription) {
      this.oauthCallbackSubscription.unsubscribe();
    }
  }

}
