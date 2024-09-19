import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { XeroOnboardingModel } from 'src/app/core/models/xero/xero-configuration/xero-onboarding.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-xero-onboarding-advanced-settings',
  templateUrl: './xero-onboarding-advanced-settings.component.html',
  styleUrls: ['./xero-onboarding-advanced-settings.component.scss']
})
export class XeroOnboardingAdvancedSettingsComponent implements OnInit {

  brandingContent = brandingContent.xero.configuration.advancedSettings;

  onboardingSteps: OnboardingStepper[] = new XeroOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }


  ngOnInit(): void {
  }

}
