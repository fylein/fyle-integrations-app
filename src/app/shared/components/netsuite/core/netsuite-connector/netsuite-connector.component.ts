import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import type { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConfigurationCta, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import type { NetsuiteConnectorGet } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import { NetsuiteConnectorModel } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import type { HelperService } from 'src/app/core/services/common/helper.service';
import type { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import type { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';
import type { NetsuiteMappingsService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-mappings.service';


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

  redirectLink: string = brandingKbArticles.onboardingArticles.NETSUITE.CONNECTOR;

  windowReference: Window;

  @Output() setupConnectionStatus = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  netsuiteCredential: NetsuiteConnectorGet | null = null;

  constructor(
    private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private toastService: IntegrationsToastService,
    private connectorService: NetsuiteConnectorService,
    private mappingsService: NetsuiteMappingsService,
    private workspaceService: WorkspaceService,
    public helper: HelperService
  ) { }

  private clearField() {
    this.connectNetsuiteForm.get("accountId")?.setValue('');
    this.connectNetsuiteForm.get("tokenId")?.setValue('');
    this.connectNetsuiteForm.get("tokenSecret")?.setValue('');
  }

  save() {
    const connectorPayload = NetsuiteConnectorModel.constructPayload(this.connectNetsuiteForm);
    this.isLoading = true;
    this.connectorService.connectNetsuite(connectorPayload).subscribe((response) => {
      this.mappingsService.refreshNetsuiteDimensions(['subsidiaries']).subscribe(() => {
        this.setupConnectionStatus.emit(true);
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connection successful.');
        this.isLoading = false;
      });
    }, () => {
      this.setupConnectionStatus.emit(false);
      this.connectNetsuiteForm = NetsuiteConnectorModel.mapAPIResponseToFormGroup(this.netsuiteCredential);
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
    });
  }

  private setupPage(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.connectorService.getNetsuiteCredentials().subscribe((netsuiteCredential: NetsuiteConnectorGet) => {
      this.netsuiteCredential = netsuiteCredential;
      this.connectNetsuiteForm = NetsuiteConnectorModel.mapAPIResponseToFormGroup(netsuiteCredential);
      this.setupConnectionStatus.emit(true);
      this.isLoading = false;
    }, () => {
      this.connectNetsuiteForm = NetsuiteConnectorModel.mapAPIResponseToFormGroup(null);
      this.setupConnectionStatus.emit(false);
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
