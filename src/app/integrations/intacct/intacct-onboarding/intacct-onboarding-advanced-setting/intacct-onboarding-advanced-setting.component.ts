import { Component, OnInit } from '@angular/core';
import { IntacctOnboardingModel } from 'src/app/core/models/intacct/intacct-configuration/intacct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-onboarding-advanced-setting',
  templateUrl: './intacct-onboarding-advanced-setting.component.html',
  styleUrls: ['./intacct-onboarding-advanced-setting.component.scss']
})
export class IntacctOnboardingAdvancedSettingComponent implements OnInit {


  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = new IntacctOnboardingModel().getOnboardingSteps(this.translocoService.translate('intacct.configuration.advancedSettings.stepName'), this.workspaceService.getOnboardingState());
  }

}
