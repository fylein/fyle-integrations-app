import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { XeroOnboardingService } from 'src/app/core/services/xero/xero-configuration/xero-onboarding.service';

@Component({
  selector: 'app-xero-onboarding-export-settings',
  templateUrl: './xero-onboarding-export-settings.component.html',
  styleUrls: ['./xero-onboarding-export-settings.component.scss']
})
export class XeroOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private xeroOnboardingService: XeroOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.xeroOnboardingService.getOnboardingSteps(this.translocoService.translate('xero.configuration.exportSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
