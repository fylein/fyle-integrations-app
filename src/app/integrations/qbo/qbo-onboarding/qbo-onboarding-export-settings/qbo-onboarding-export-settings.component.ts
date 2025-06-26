import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { QBOOnboardingModel } from 'src/app/core/models/qbo/qbo-configuration/qbo-onboarding.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbo-onboarding-export-settings',
  templateUrl: './qbo-onboarding-export-settings.component.html',
  styleUrls: ['./qbo-onboarding-export-settings.component.scss']
})
export class QboOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = new QBOOnboardingModel().getOnboardingSteps(this.translocoService.translate('configuration.exportSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
