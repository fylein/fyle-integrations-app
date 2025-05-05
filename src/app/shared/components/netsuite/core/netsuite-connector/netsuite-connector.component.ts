import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { NetsuiteConnectorGet } from 'src/app/core/models/netsuite/netsuite-configuration/netsuite-connector.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';


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

  isNetsuiteCredentialsInvalid: boolean;

  windowReference: Window;

  @Output() setupConnectionStatus = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  netsuiteCredential: NetsuiteConnectorGet | null = null;

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private connectorService: NetsuiteConnectorService,
    public helper: HelperService
  ) { }

  save() {
    this.connectorService.connectNetsuite(this.connectNetsuiteForm);
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    this.connectorService.getNetsuiteFormGroup();

    this.connectorService.connectNetsuiteForm$.subscribe((netSuiteSetupForm) => {
      this.connectNetsuiteForm = netSuiteSetupForm;
    });

    this.connectorService.setupConnectionStatus$.subscribe((isNetSuiteConnected) => {
      this.setupConnectionStatus.emit(isNetSuiteConnected);
    });

    this.connectorService.isLoading$.subscribe((isConnectionInProgress) => {
      this.isLoading = isConnectionInProgress;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }
}
