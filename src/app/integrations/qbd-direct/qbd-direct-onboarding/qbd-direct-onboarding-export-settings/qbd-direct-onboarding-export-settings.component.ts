import { Component, OnInit } from '@angular/core';
import { QbdDirectExportSettingsComponent } from "../../qbd-direct-shared/qbd-direct-export-settings/qbd-direct-export-settings.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { QbdDirectOnboardingService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.service';

@Component({
  selector: 'app-qbd-direct-onboarding-export-settings',
  standalone: true,
  imports: [QbdDirectExportSettingsComponent, SharedModule, CommonModule, TranslocoModule],
  templateUrl: './qbd-direct-onboarding-export-settings.component.html',
  styleUrl: './qbd-direct-onboarding-export-settings.component.scss'
})
export class QbdDirectOnboardingExportSettingsComponent implements OnInit {

  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private onboardingService: QbdDirectOnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingSteps = this.onboardingService.getOnboardingSteps(this.translocoService.translate('configuration.exportSetting.stepName'), this.workspaceService.getOnboardingState());
  }

}
