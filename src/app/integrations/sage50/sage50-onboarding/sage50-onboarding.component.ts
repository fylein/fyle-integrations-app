
import { Component, OnInit } from '@angular/core';
import { Sage50OnboardingService } from 'src/app/core/services/sage50/sage50-configuration/sage50-onboarding.service';
import { AppName, Sage50AttributeType } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';

@Component({
    selector: 'app-sage50-onboarding',
    imports: [SharedModule, RouterOutlet],
    templateUrl: './sage50-onboarding.component.html',
    styleUrl: './sage50-onboarding.component.scss'
})
export class Sage50OnboardingComponent implements OnInit {

  onboardingSteps: OnboardingStepper[];

  readonly AppName = AppName;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingKbArticles = brandingKbArticles;

  readonly brandingDemoVideoLinks = brandingDemoVideoLinks;

  readonly Sage50AttributeType = Sage50AttributeType;

  constructor(
    private onboardingService: Sage50OnboardingService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) {}

  get path() {
    return this.router.url;
  }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps(this.workspaceService.getOnboardingState());
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onboardingSteps = this.onboardingService.getOnboardingSteps(this.workspaceService.getOnboardingState());
      }
    });
  }
}
