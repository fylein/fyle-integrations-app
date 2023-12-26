import { Component, OnInit } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-qbo-clone-settings',
  templateUrl: './qbo-clone-settings.component.html',
  styleUrls: ['./qbo-clone-settings.component.scss']
})
export class QboCloneSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  isLoading: boolean = true;

  brandingConfig = brandingConfig;

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  private setupOnboardingSteps(): void {
    const onboardingSteps = new QBOOnboardingModel().getOnboardingSteps('Clone Settings', this.workspaceService.getOnboardingState());
    this.onboardingSteps.push(onboardingSteps[0]);
    this.onboardingSteps.push({
      active: false,
      completed: false,
      number: 6,
      step: 'Clone Settings',
      icon: 'advanced-setting',
      route: '/integrations/qbo/onboarding/clone_settings',
      size: {
        height: '20px',
        width: '20px'
      },
      styleClasses: ['step-name-export--text', 'step-name-advanced--icon']
    });

    this.isLoading = false;
  }

  ngOnInit(): void {
    this.setupOnboardingSteps();
  }

}
