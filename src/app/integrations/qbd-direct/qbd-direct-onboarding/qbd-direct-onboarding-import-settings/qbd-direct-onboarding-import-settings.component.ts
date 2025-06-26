import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-direct-onboarding-import-settings',
  standalone: true,
  imports: [QbdDirectSharedModule, SharedModule, CommonModule],
  templateUrl: './qbd-direct-onboarding-import-settings.component.html',
  styleUrl: './qbd-direct-onboarding-import-settings.component.scss'
})
export class QbdDirectOnboardingImportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = new QbdDirectOnboardingModel().getOnboardingSteps(this.translocoService.translate('configuration.importSetting.stepName'), this.workspaceService.getOnboardingState());
  }


}
