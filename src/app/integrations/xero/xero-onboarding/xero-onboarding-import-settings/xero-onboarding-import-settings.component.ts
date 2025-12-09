import { Component, OnInit } from '@angular/core';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TranslocoService } from '@jsverse/transloco';
import { XeroOnboardingService } from 'src/app/core/services/xero/xero-configuration/xero-onboarding.service';

@Component({
  selector: 'app-xero-onboarding-import-settings',
  templateUrl: './xero-onboarding-import-settings.component.html',
  styleUrls: ['./xero-onboarding-import-settings.component.scss'],
  standalone: false,
})
export class XeroOnboardingImportSettingsComponent implements OnInit {
  onboardingSteps: OnboardingStepper[] = [];

  constructor(
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService,
    private xeroOnboardingService: XeroOnboardingService,
  ) {}

  ngOnInit(): void {
    this.onboardingSteps = this.xeroOnboardingService.getOnboardingSteps(
      this.translocoService.translate('xero.configuration.importSetting.stepName'),
      this.workspaceService.getOnboardingState(),
    );
  }
}
