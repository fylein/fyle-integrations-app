import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { NetsuiteConnectorModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import { NetsuiteMappingsService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-mappings.service';


@Component({
  selector: 'app-netsuite-connector',
  templateUrl: './netsuite-connector.component.html',
  styleUrls: ['./netsuite-connector.component.scss']
})
export class NetsuiteConnectorComponent implements OnInit {

  isLoading: boolean = true;

  connectNetsuiteForm: FormGroup;

  ConfigurationCtaText = ConfigurationCta;

  isOnboarding: boolean;

  saveInProgress: boolean = false;

  redirectLink: string = brandingKbArticles.onboardingArticles.INTACCT.CONNECTOR;

  windowReference: Window;

  @Output() setupConnectionStatus = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private connectorService: NetsuiteConnectorService,
    private mappingsService: NetsuiteMappingsService,
  ) { }

  private clearField() {
    this.connectNetsuiteForm.get("accountId")?.setValue('');
    this.connectNetsuiteForm.get("tokenId")?.setValue('');
    this.connectNetsuiteForm.get("tokenSecret")?.setValue('');
  }

  save() {

    const connector_payload = NetsuiteConnectorModel.constructPayload(
      this.connectNetsuiteForm.value.accountId,
      this.connectNetsuiteForm.value.tokenId,
      this.connectNetsuiteForm.value.tokenSecret
    )

    this.isLoading = true;
    this.connectorService.connectNetsuite(connector_payload).subscribe((response) => {
      this.mappingsService.refreshNetsuiteDimensions(['subsidiaries']).subscribe(() => {
        this.setupConnectionStatus.emit(true);
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connection Successful.');
        this.isLoading = false;
      });
    }, () => {
      this.setupConnectionStatus.emit(false);
      this.clearField();
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
    });
  }

  private setupPage(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.connectorService.getNetsuiteCredentials().subscribe((netsuiteCredential) => {
      this.setupConnectionStatus.emit(true);
      this.isLoading = false;
    }, () => {
      this.connectNetsuiteForm = this.formBuilder.group({
        accountId: ['', Validators.required],
        tokenId: ['', Validators.required],
        tokenSecret: ['', Validators.required]
      });
      this.setupConnectionStatus.emit(false);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}