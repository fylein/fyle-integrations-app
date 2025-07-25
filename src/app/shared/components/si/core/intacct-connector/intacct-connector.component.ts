import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/intacct-connector.service';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';

@Component({
    selector: 'app-intacct-connector',
    templateUrl: './intacct-connector.component.html',
    styleUrls: ['./intacct-connector.component.scss'],
    standalone: false
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
    private intacctConnectorService: IntacctConnectorService
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


  ngOnInit(): void {
    this.setupPage();
  }
}
