import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingFeatureConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';
import { ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
    selector: 'app-intacct-connector',
    templateUrl: './intacct-connector.component.html',
    styleUrls: ['./intacct-connector.component.scss'],
    standalone: false
})
export class IntacctConnectorComponent implements OnInit {

  isLoading: boolean = true;

  connectSageIntacctForm: FormGroup;

  isMigratedToRestApi: boolean = false;

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
    private workspaceService: SiWorkspaceService
  ) { }

  save() {
    this.isLoading = true;
    this.saveInProgress = true;

    this.intacctConnectorService.connectSageIntacct(this.connectSageIntacctForm)
    .subscribe((response) => {
      this.connectSageIntacctForm = response.intacctSetupForm;
      this.setupConnectionStatus.emit(response.isIntacctConnected);
      if (!response.isIntacctConnected){
      this.isLoading = false;
      this.saveInProgress = false;
      }
    });
  }

  private setupPage(): void {
    this.isLoading = true;
    this.isOnboarding = this.router.url.includes('onboarding');
    this.workspaceService.getFeatureConfigs().subscribe((featureConfigs) => {
      this.isMigratedToRestApi = featureConfigs.migrated_to_rest_api;
      this.intacctConnectorService.getIntacctFormGroup(this.isMigratedToRestApi).subscribe((intacctFormGroup) => {
        this.connectSageIntacctForm = intacctFormGroup.intacctSetupForm;
        this.isLoading = false;
      });
    });
  }


  ngOnInit(): void {
    this.setupPage();
  }
}
