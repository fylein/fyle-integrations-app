import { Component, OnInit } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { IntacctOnboardingService } from 'src/app/core/services/intacct/intacct-configuration/intacct-onboarding.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-onboarding-import-setting',
  templateUrl: './intacct-onboarding-import-setting.component.html',
  styleUrls: ['./intacct-onboarding-import-setting.component.scss']
})
export class IntacctOnboardingImportSettingComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  readonly brandingConfig = brandingConfig;

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private intacctOnboardingService: IntacctOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.intacctOnboardingService.getOnboardingSteps(this.translocoService.translate('configuration.importSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
