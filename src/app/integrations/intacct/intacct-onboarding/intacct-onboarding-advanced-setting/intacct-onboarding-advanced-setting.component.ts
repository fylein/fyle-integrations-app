import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { IntacctOnboardingService } from 'src/app/core/services/si/si-configuration/si-onboarding.service';

@Component({
    selector: 'app-intacct-onboarding-advanced-setting',
    templateUrl: './intacct-onboarding-advanced-setting.component.html',
    styleUrls: ['./intacct-onboarding-advanced-setting.component.scss'],
    standalone: false
})
export class IntacctOnboardingAdvancedSettingComponent implements OnInit {


  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private intacctOnboardingService: IntacctOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.intacctOnboardingService.getOnboardingSteps(this.translocoService.translate('intacct.configuration.advancedSettings.stepName'), this.workspaceService.getOnboardingState());
  }

}
