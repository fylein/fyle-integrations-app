import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import type { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-intacct-onboarding-export-setting',
  templateUrl: './intacct-onboarding-export-setting.component.html',
  styleUrls: ['./intacct-onboarding-export-setting.component.scss']
})
export class IntacctOnboardingExportSettingComponent implements OnInit {

  readonly brandingContent = brandingContent.intacct.configuration.exportSetting;

  onboardingSteps: OnboardingStepper[] = new IntacctOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
