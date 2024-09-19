import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbo-onboarding-employee-settings',
  templateUrl: './qbo-onboarding-employee-settings.component.html',
  styleUrls: ['./qbo-onboarding-employee-settings.component.scss']
})
export class QboOnboardingEmployeeSettingsComponent implements OnInit {

  brandingContent = brandingContent.configuration.employeeSetting;

  onboardingSteps: OnboardingStepper[] = new QBOOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
