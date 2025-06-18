import { Component, OnInit } from '@angular/core';
import { QbdDirectExportSettingsComponent } from "../../qbd-direct-shared/qbd-direct-export-settings/qbd-direct-export-settings.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { QbdDirectOnboardingModel } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-onboarding.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { brandingContent } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-qbd-direct-onboarding-export-settings',
  standalone: true,
  imports: [QbdDirectExportSettingsComponent, SharedModule, CommonModule, TranslocoModule],
  templateUrl: './qbd-direct-onboarding-export-settings.component.html',
  styleUrl: './qbd-direct-onboarding-export-settings.component.scss'
})
export class QbdDirectOnboardingExportSettingsComponent implements OnInit {

  readonly brandingContent = brandingContent.qbd_direct.configuration.exportSetting;

  onboardingSteps: OnboardingStepper[] = new QbdDirectOnboardingModel().getOnboardingSteps(this.brandingContent.stepName, this.workspaceService.getOnboardingState());

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
  }

}
