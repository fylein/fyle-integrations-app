import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingContent, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntacctConnectorModel } from 'src/app/core/models/intacct/intacct-configuration/connector.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-intacct-connector',
  templateUrl: './intacct-connector.component.html',
  styleUrls: ['./intacct-connector.component.scss']
})
export class IntacctConnectorComponent implements OnInit {

  isLoading: boolean = true;

  connectSageIntacctForm: FormGroup;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  redirectLink: string = brandingKbArticles.onboardingArticles.INTACCT.CONNECTOR;

  windowReference: Window;

  @Output() setupConnectionStatus = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  readonly brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private intacctConnectorService: IntacctConnectorService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService,
    private translocoService: TranslocoService
  ) { }

  save() {
    this.isLoading = true;
    this.saveInProgress = true;

    this.intacctConnectorService.connectSageIntacct(this.connectSageIntacctForm)
    .subscribe((response) => {
      this.connectSageIntacctForm = response.intacctSetupForm;
      this.isLoading = false;
      this.saveInProgress = false;
      this.setupConnectionStatus.emit(response.isIntacctConnected);
    });
  }

  private setupPage(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.intacctConnectorService.getIntacctFormGroup().subscribe((response) => {
      this.connectSageIntacctForm = response.intacctSetupForm;
      this.isLoading = false;
    });
  }

    save() {
      const userID = this.connectSageIntacctForm.get('userID')?.value;
      const companyID = this.connectSageIntacctForm.get('companyID')?.value;
      const userPassword = this.connectSageIntacctForm.get('userPassword')?.value;

      this.isLoading = true;
      this.saveInProgress = true;

      const sageIntacctConnection = IntacctConnectorModel.constructPayload(this.connectSageIntacctForm);

      this.connectorService.connectSageIntacct(sageIntacctConnection).subscribe((response) => {
        this.mappingsService.refreshSageIntacctDimensions(['location_entities']).subscribe(() => {
          this.setupConnectionStatus.emit(true);
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('intacctConnector.connectionSuccessToast'));
          this.isLoading = false;
          this.saveInProgress = false;
        });
      }, () => {
        this.setupConnectionStatus.emit(false);
        this.clearField();
        this.isLoading = false;
        this.saveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('intacctConnector.connectionErrorToast'));
      });
    }

    private setupPage(): void {
      this.isLoading = true;
      this.isOnboarding = this.router.url.includes('onboarding');
      this.connectorService.getSageIntacctCredential().subscribe((intacctCredential) => {
        this.connectSageIntacctForm = IntacctConnectorModel.mapAPIResponseToFormGroup(intacctCredential);
        this.setupConnectionStatus.emit(true);
        this.isLoading = false;
      }, () => {
        this.connectSageIntacctForm = IntacctConnectorModel.mapAPIResponseToFormGroup(null);
        this.setupConnectionStatus.emit(false);
        this.isLoading = false;
      });
    }

  ngOnInit(): void {
    this.setupPage();
  }
}
