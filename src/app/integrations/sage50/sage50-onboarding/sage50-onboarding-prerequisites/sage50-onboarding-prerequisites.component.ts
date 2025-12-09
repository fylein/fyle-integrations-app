import { Component, OnInit } from '@angular/core';
import { Sage50OnboardingService } from 'src/app/core/services/sage50/sage50-configuration/sage50-onboarding.service';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import {
  AppName,
  ConfigurationWarningEvent,
  Sage50AttributeType,
  Sage50OnboardingState,
  TrackingApp,
} from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { CommonModule } from '@angular/common';
import {
  brandingConfig,
  brandingDemoVideoLinks,
  brandingKbArticles,
  brandingStyle,
} from 'src/app/branding/branding-config';
import { Router } from '@angular/router';
import { ConfigurationCsvUploadFieldComponent } from 'src/app/shared/components/configuration/configuration-csv-upload-field/configuration-csv-upload-field.component';
import { ConfigurationWarningOut } from 'src/app/core/models/misc/configuration-warning.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-sage50-onboarding-prerequisites',
  imports: [SharedModule, CommonModule, ConfigurationCsvUploadFieldComponent],
  templateUrl: './sage50-onboarding-prerequisites.component.html',
  styleUrl: './sage50-onboarding-prerequisites.component.scss',
})
export class Sage50OnboardingPrerequisitesComponent implements OnInit {
  onboardingSteps = this.onboardingService.getOnboardingSteps(this.workspaceService.getOnboardingState());

  isLoading = true;

  fileNames = {
    ACCOUNT: null,
    VENDOR: null,
  } as Record<Sage50AttributeType, string | null>;

  readonly AppName = AppName;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingKbArticles = brandingKbArticles;

  readonly brandingDemoVideoLinks = brandingDemoVideoLinks;

  readonly Sage50AttributeType = Sage50AttributeType;

  readonly ConfigurationWarningEvent = ConfigurationWarningEvent;

  showVendorUploadWarning: boolean = false;

  constructor(
    private onboardingService: Sage50OnboardingService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private sage50ImportAttributesService: Sage50ImportAttributesService,
    private trackingService: TrackingService,
  ) {}

  get isFormFilled() {
    return this.fileNames.ACCOUNT !== null;
  }

  continueToNextStep() {
    if (!this.fileNames.VENDOR) {
      this.showVendorUploadWarning = true;
      return;
    }
    this.proceedToNextStep();
  }

  acceptVendorUploadWarning(data: ConfigurationWarningOut): void {
    this.showVendorUploadWarning = false;
    if (data.hasAccepted) {
      this.proceedToNextStep();
    }
  }

  private proceedToNextStep(): void {
    this.trackingService.onOnboardingStepCompletion(TrackingApp.SAGE50, Sage50OnboardingState.PRE_REQUISITES, 1, {
      skippedVendorUpload: this.fileNames.VENDOR ? false : true,
    });
    this.workspaceService
      .updateWorkspaceOnboardingState({
        onboarding_state: Sage50OnboardingState.EXPORT_SETTINGS,
      })
      .subscribe();
    this.workspaceService.setOnboardingState(Sage50OnboardingState.EXPORT_SETTINGS);
    this.router.navigate(['/integrations/sage50/onboarding/export_settings']);
  }

  ngOnInit(): void {
    this.sage50ImportAttributesService.getAttributeTypeToFileNameMap().subscribe((attributeTypeToFileNameMap) => {
      this.fileNames = attributeTypeToFileNameMap;
      this.isLoading = false;
    });
  }

  uploadData(attributeType: Sage50AttributeType, fileName: string, jsonData: any) {
    return this.sage50ImportAttributesService.importAttributes(attributeType, fileName, jsonData);
  }
}
