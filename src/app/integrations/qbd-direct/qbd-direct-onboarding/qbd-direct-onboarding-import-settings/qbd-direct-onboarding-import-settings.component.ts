import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { QbdDirectOnboardingService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.service';

@Component({
  selector: 'app-qbd-direct-onboarding-import-settings',
  imports: [QbdDirectSharedModule, SharedModule],
  templateUrl: './qbd-direct-onboarding-import-settings.component.html',
  styleUrl: './qbd-direct-onboarding-import-settings.component.scss',
})
export class QbdDirectOnboardingImportSettingsComponent implements OnInit {
  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private onboardingService: QbdDirectOnboardingService,
  ) {}

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps(
      this.translocoService.translate('configuration.importSetting.stepName'),
      this.workspaceService.getOnboardingState(),
    );
  }
}
