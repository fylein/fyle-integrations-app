import { Component } from '@angular/core';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, Sage50OnboardingState } from 'src/app/core/models/enum/enum.model';
import { BrandingService } from 'src/app/core/services/common/branding.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sage50-onboarding-landing',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sage50-onboarding-landing.component.html',
  styleUrl: './sage50-onboarding-landing.component.scss'
})
export class Sage50OnboardingLandingComponent {
  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.onboardingArticles.SAGE50.LANDING;

  embedVideoLink = brandingDemoVideoLinks.onboarding.SAGE50;

  appName: AppName = AppName.SAGE50;

  constructor(
    private workspaceService: WorkspaceService,
    public brandingService: BrandingService
  ) {}

  handleConnectButtonClick() {
    this.workspaceService.updateWorkspaceOnboardingState({
      onboarding_state: Sage50OnboardingState.PRE_REQUISITES
    }).subscribe();
    this.workspaceService.setOnboardingState(Sage50OnboardingState.PRE_REQUISITES);
  }
}
