import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectAdvancedSettingsComponent } from "../../qbd-direct-shared/qbd-direct-advanced-settings/qbd-direct-advanced-settings.component";
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { QbdDirectOnboardingService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.service';

@Component({
    selector: 'app-qbd-direct-onboarding-advanced-settings',
    imports: [CommonModule, QbdDirectSharedModule, SharedModule, QbdDirectAdvancedSettingsComponent],
    templateUrl: './qbd-direct-onboarding-advanced-settings.component.html',
    styleUrl: './qbd-direct-onboarding-advanced-settings.component.scss'
})
export class QbdDirectOnboardingAdvancedSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private onboardingService: QbdDirectOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps(this.translocoService.translate('configuration.advancedSettings.stepName'), this.workspaceService.getOnboardingState());
  }

}
