import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QbdDirectSharedModule } from '../../qbd-direct-shared/qbd-direct-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QbdDirectAdvancedSettingsComponent } from "../../qbd-direct-shared/qbd-direct-advanced-settings/qbd-direct-advanced-settings.component";
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-qbd-direct-onboarding-advanced-settings',
  standalone: true,
  imports: [CommonModule, QbdDirectSharedModule, SharedModule, QbdDirectAdvancedSettingsComponent],
  templateUrl: './qbd-direct-onboarding-advanced-settings.component.html',
  styleUrl: './qbd-direct-onboarding-advanced-settings.component.scss'
})
export class QbdDirectOnboardingAdvancedSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = new QbdDirectOnboardingModel().getOnboardingSteps(this.translocoService.translate('configuration.advancedSettings.stepName'), this.workspaceService.getOnboardingState());
  }

}
