import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectAdvancedSettingsComponent } from "../../qbd-direct-shared/qbd-direct-advanced-settings/qbd-direct-advanced-settings.component";
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { brandingContent } from 'src/app/branding/branding-config';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbd-direct-onboarding-advanced-settings',
  standalone: true,
  imports: [CommonModule, QbdDirectSharedModule, SharedModule, QbdDirectAdvancedSettingsComponent],
  templateUrl: './qbd-direct-onboarding-advanced-settings.component.html',
  styleUrl: './qbd-direct-onboarding-advanced-settings.component.scss'
})
export class QbdDirectOnboardingAdvancedSettingsComponent implements OnInit {

  brandingContent = brandingContent.configuration.advancedSettings;

  onboardingSteps: OnboardingStepper[] = new QbdDirectOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
