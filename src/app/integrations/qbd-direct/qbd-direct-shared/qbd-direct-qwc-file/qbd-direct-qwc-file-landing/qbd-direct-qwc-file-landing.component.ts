import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { BrandingService } from 'src/app/core/services/common/branding.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdDirectConnectorService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-connector.service';
import { QbdConnectorGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { NextStepOption, RegenerateQwcForm } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';

@Component({
  selector: 'app-qbd-direct-qwc-file-landing',
  imports: [CommonModule, SharedModule, TranslocoModule],
  templateUrl: './qbd-direct-qwc-file-landing.component.html',
  styleUrl: './qbd-direct-qwc-file-landing.component.scss'
})
export class QbdDirectQwcFileLandingComponent implements OnInit {

  // Component state
  isLoading: boolean;

  regenerateQwcForm: FormGroup<RegenerateQwcForm>;

  connectorSettings: QbdConnectorGet | null = null;

  // Constants for template
  readonly NextStepOption = NextStepOption;

  readonly appName: AppName = AppName.QBD_DIRECT;

  readonly redirectLink: string = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  readonly ConfigurationCtaText = ConfigurationCta;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  get selectedNextStep(): NextStepOption {
    return this.regenerateQwcForm.get('nextStep')?.value as NextStepOption;
  }

  constructor(
    private formBuilder: FormBuilder,
    public brandingService: BrandingService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
    private qbdDirectConnectorService: QbdDirectConnectorService
  ) {}

  continue() {
    // TODO: Implement continue logic
  }

  copyQwcFilePath() {
    if (!this.connectorSettings?.file_location) {
      return;
    }
    navigator.clipboard.writeText(this.connectorSettings.file_location);
    this.toastService.displayToastMessage(
      ToastSeverity.SUCCESS,
      this.translocoService.translate('qbdDirectQwcFileLanding.qwcFilePathCopied')
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.regenerateQwcForm = this.formBuilder.group<RegenerateQwcForm>({
      nextStep: new FormControl(null)
    }, {
      validators: (form) => {
        const errors: ValidationErrors = {};

        if (form.get('nextStep')?.value === null) {
          errors.nextStep = { required: true };
        }

        return Object.keys(errors).length > 0 ? errors : null;
      }
    });

    this.qbdDirectConnectorService.getQBDConnectorSettings().subscribe((qbdConnectorSettings: QbdConnectorGet) => {
      this.connectorSettings = qbdConnectorSettings;
      this.isLoading = false;
    });
  }
}
