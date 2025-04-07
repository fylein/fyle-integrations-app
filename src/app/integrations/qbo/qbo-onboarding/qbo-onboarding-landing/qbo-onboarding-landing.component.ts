import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';

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

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private qboAuthService: QboAuthService
  ) { }

  acceptWarning(data: ConfigurationWarningOut): void {
    this.isIncorrectQBOConnectedDialogVisible = false;
    if (data.hasAccepted) {
      this.router.navigate([`/integrations/qbo/onboarding/landing`]);
    }
  }

  connectQbo(): void {
    this.qboAuthService.connectQbo();
  }

  ngOnInit(): void {
    this.qboAuthService.qboConnectionInProgress$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status: boolean) => {
      this.qboConnectionInProgress = status;
    });

    this.qboAuthService.isIncorrectQBOConnectedDialogVisible$
    .pipe(takeUntil(this.destroy$))
    .subscribe((visible: boolean) => {
      this.isIncorrectQBOConnectedDialogVisible = visible;
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
