import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-intacct-onboarding-import-setting',
  templateUrl: './intacct-onboarding-import-setting.component.html',
  styleUrls: ['./intacct-onboarding-import-setting.component.scss']
})
export class IntacctOnboardingImportSettingComponent implements OnInit {

  readonly brandingContent = brandingContent.configuration.importSetting;

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  readonly brandingConfig = brandingConfig;

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
