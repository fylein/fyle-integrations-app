import { Component, OnInit } from '@angular/core';
import { Sage50OnboardingService } from 'src/app/core/services/sage50/sage50-configuration/sage50-onboarding.service';
import { Sage50ImportAttributesService } from 'src/app/core/services/sage50/sage50-configuration/sage50-import-attributes.service';
import { AppName, Sage50AttributeType, Sage50OnboardingState } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { CommonModule } from '@angular/common';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { Router } from '@angular/router';
import { ConfigurationCsvUploadFieldComponent } from "src/app/shared/components/configuration/configuration-csv-upload-field/configuration-csv-upload-field.component";

@Component({
  selector: 'app-sage50-onboarding-prerequisites',
  standalone: true,
  imports: [SharedModule, CommonModule, ConfigurationCsvUploadFieldComponent],
  templateUrl: './sage50-onboarding-prerequisites.component.html',
  styleUrl: './sage50-onboarding-prerequisites.component.scss'
})
export class Sage50OnboardingPrerequisitesComponent implements OnInit {

  onboardingSteps = this.onboardingService.getOnboardingSteps(this.workspaceService.getOnboardingState());

  isLoading = true;

  fileNames = {
    ACCOUNT: null,
    VENDOR: null
  } as Record<Sage50AttributeType, string | null>;

  readonly AppName = AppName;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  readonly brandingKbArticles = brandingKbArticles;

  readonly brandingDemoVideoLinks = brandingDemoVideoLinks;

  readonly Sage50AttributeType = Sage50AttributeType;

  constructor(
    private onboardingService: Sage50OnboardingService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private sage50ImportAttributesService: Sage50ImportAttributesService
  ) {}

  get isFormFilled() {
    return this.fileNames.ACCOUNT !== null;
  }

  continueToNextStep() {
    this.workspaceService.setOnboardingState(Sage50OnboardingState.EXPORT_SETTINGS);
    this.router.navigate(['/integrations/sage50/onboarding/export_settings']);
  }

  ngOnInit(): void {
    this.sage50ImportAttributesService.getAttributeTypeToFileNameMap()
      .subscribe((attributeTypeToFileNameMap) => {
        this.fileNames = attributeTypeToFileNameMap;
        this.isLoading = false;
      });
  }
}
