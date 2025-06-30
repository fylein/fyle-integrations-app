import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntacctOnboardingService } from 'src/app/core/services/intacct/intacct-configuration/intacct-onboarding.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-onboarding-export-setting',
  templateUrl: './intacct-onboarding-export-setting.component.html',
  styleUrls: ['./intacct-onboarding-export-setting.component.scss']
})
export class IntacctOnboardingExportSettingComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private intacctOnboardingService: IntacctOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.intacctOnboardingService.getOnboardingSteps(this.translocoService.translate('intacct.configuration.exportSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
