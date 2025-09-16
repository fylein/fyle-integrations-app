import { Component } from '@angular/core';
import { Sage50OnboardingService } from 'src/app/core/services/sage50/sage50-configuration/sage50-onboarding.service';
import { AppName, Sage50OnboardingState } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sage50-onboarding-prerequisites',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './sage50-onboarding-prerequisites.component.html',
  styleUrl: './sage50-onboarding-prerequisites.component.scss'
})
export class Sage50OnboardingPrerequisitesComponent {

  onboardingSteps = this.onboardingService.getOnboardingSteps(this.workspaceService.getOnboardingState());

  isLoading: boolean;

  AppName = AppName;

  readonly brandingStyle = brandingStyle;

  readonly brandingKbArticles = brandingKbArticles;

  constructor(
    private onboardingService: Sage50OnboardingService,
    private workspaceService: WorkspaceService,
    private router: Router
  ) {}

  get isFormFilled() {
    return true;
  }

  continueToNextStep() {
    this.workspaceService.setOnboardingState(Sage50OnboardingState.EXPORT_SETTINGS);
    this.router.navigate(['/integrations/sage50/onboarding/export_settings']);
  }
}
