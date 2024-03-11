import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingContent, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

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

  readonly brandingContent = brandingContent;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private connectorService: IntacctConnectorService,
    private mappingsService: SiMappingsService,
    private toastService: IntegrationsToastService
  ) { }

  private clearField() {
    this.connectSageIntacctForm.get("userID")?.setValue('');
    this.connectSageIntacctForm.get("companyID")?.setValue('');
    this.connectSageIntacctForm.get("userPassword")?.setValue('');
  }

    save() {
      const userID = this.connectSageIntacctForm.value.userID;
      const companyID = this.connectSageIntacctForm.value.companyID;
      const userPassword = this.connectSageIntacctForm.value.userPassword;

      this.isLoading = true;
      this.saveInProgress = true;

      this.connectorService.connectSageIntacct({
        si_user_id: userID,
        si_company_id: companyID,
        si_user_password: userPassword
      }).subscribe((response) => {
        this.mappingsService.refreshSageIntacctDimensions(['location_entities']).subscribe(() => {
          this.setupConnectionStatus.emit(true);
          this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connection Successful.');
          this.isLoading = false;
          this.saveInProgress = false;
        });
      }, () => {
        this.setupConnectionStatus.emit(false);
        this.clearField();
        this.isLoading = false;
        this.saveInProgress = false;
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
      });
    }

    private setupPage(): void {
      this.isLoading = true;
      this.isOnboarding = this.router.url.includes('onboarding');
      this.connectorService.getSageIntacctCredential().subscribe((intacctCredential) => {
        this.setupConnectionStatus.emit(true);
        this.isLoading = false;
      }, () => {
        this.connectSageIntacctForm = this.formBuilder.group({
          userID: ['', Validators.required],
          companyID: ['', Validators.required],
          userPassword: ['', Validators.required]
        });
        this.setupConnectionStatus.emit(false);
        this.isLoading = false;
      });
    }

  ngOnInit(): void {
    this.setupPage();
  }
}
