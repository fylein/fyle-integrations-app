import { Component, OnInit } from '@angular/core';
import { brandingContent } from 'src/app/branding/branding-config';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { XeroOnboardingModel } from 'src/app/core/models/xero/xero-configuration/xero-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-xero-onboarding-import-settings',
  templateUrl: './xero-onboarding-import-settings.component.html',
  styleUrls: ['./xero-onboarding-import-settings.component.scss']
})
export class XeroOnboardingImportSettingsComponent implements OnInit {

  brandingContent = brandingContent.xero.configuration.importSetting;

  onboardingSteps: OnboardingStepper[] = new XeroOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
