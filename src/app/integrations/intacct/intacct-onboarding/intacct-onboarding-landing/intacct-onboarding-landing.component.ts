import { Component, OnInit } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';
import { BrandingService } from 'src/app/core/services/common/branding.service';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { catchError, of } from 'rxjs';
import { FeatureConfig } from 'src/app/core/models/intacct/db/feature-config.model';

@Component({
  selector: 'app-intacct-onboarding-landing',
  templateUrl: './intacct-onboarding-landing.component.html',
  styleUrls: ['./intacct-onboarding-landing.component.scss']
})
export class IntacctOnboardingLandingComponent implements OnInit {

  appName: AppName = AppName.INTACCT;

  redirectLink = brandingKbArticles.onboardingArticles.INTACCT.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.INTACCT;

  readonly brandingConfig = brandingConfig;

  private migratedToRestApi: boolean = false;

  _isIntacctConnectionInProgress = false;

  get isIntacctConnectionInProgress() {
    return this.migratedToRestApi && this._isIntacctConnectionInProgress;
  }

  get postConnectionRoute() {
    return this.migratedToRestApi ? undefined : 'intacct/onboarding/connector';
  }

  isLoading: boolean = false;

  constructor(
    public brandingService: BrandingService,
    private siAuthService: SiAuthService,
    private siWorkspaceService: SiWorkspaceService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.siWorkspaceService.getFeatureConfigs()
      .pipe(catchError(() => of(null)))
      .subscribe((featureConfig: FeatureConfig | null) => {
        this.migratedToRestApi = featureConfig?.migrated_to_rest_api ?? false;
        this.isLoading = false;
      });
  }

  connectIntacct() {
    if (!this.migratedToRestApi) {
      return;
    }
    this._isIntacctConnectionInProgress = true;
    this.siAuthService.connectIntacct().subscribe(() => {
      this._isIntacctConnectionInProgress = false;
    });
  }
}
