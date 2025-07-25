import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { QboOnboardingService } from 'src/app/core/services/qbo/qbo-configuration/qbo-onboarding.service';

@Component({
    selector: 'app-qbo-onboarding-export-settings',
    templateUrl: './qbo-onboarding-export-settings.component.html',
    styleUrls: ['./qbo-onboarding-export-settings.component.scss'],
    standalone: false
})
export class QboOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private qboOnboardingService: QboOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.qboOnboardingService.getOnboardingSteps(this.translocoService.translate('configuration.exportSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
