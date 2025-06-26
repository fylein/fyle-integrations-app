import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { XeroOnboardingModel } from 'src/app/core/models/xero/xero-configuration/xero-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-xero-onboarding-export-settings',
  templateUrl: './xero-onboarding-export-settings.component.html',
  styleUrls: ['./xero-onboarding-export-settings.component.scss']
})
export class XeroOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = new XeroOnboardingModel().getOnboardingSteps(this.translocoService.translate('xero.configuration.exportSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
