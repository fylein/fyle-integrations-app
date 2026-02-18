import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { BrandingService } from 'src/app/core/services/common/branding.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { QbdDirectConnectorService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-connector.service';
import { QbdConnectorGet } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-connector.model';
import { QwcRegenerationFlowType, RegenerateQwcForm } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';
import { ActivatedRoute, Router } from '@angular/router';

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
  readonly NextStepOption = QwcRegenerationFlowType;

  readonly appName: AppName = AppName.QBD_DIRECT;

  readonly redirectLink: string = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  readonly ConfigurationCtaText = ConfigurationCta;

  readonly brandingStyle = brandingStyle;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  get selectedNextStep(): QwcRegenerationFlowType {
    return this.regenerateQwcForm.get('nextStep')?.value as QwcRegenerationFlowType;
  }

  constructor(
    private formBuilder: FormBuilder,
    public brandingService: BrandingService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService,
    private qbdDirectConnectorService: QbdDirectConnectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  continue() {
    if (!this.selectedNextStep) {
      return;
    }
    const nextStepRoute = this.selectedNextStep === QwcRegenerationFlowType.EXISTING ? 'existing' : 'new';
    this.router.navigate([nextStepRoute], { relativeTo: this.route });
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
      nextStep: new FormControl(null, [Validators.required])
    });

    this.qbdDirectConnectorService.getQBDConnectorSettings().subscribe((qbdConnectorSettings: QbdConnectorGet) => {
      this.connectorSettings = qbdConnectorSettings;
      this.isLoading = false;
    });
  }
}
