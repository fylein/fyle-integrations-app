import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ConfigurationCta, Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { Sage300ConnectorService } from 'src/app/core/services/sage300/sage300-configuration/sage300-connector.service';
import { Sage300OnboardingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-onboarding.service';

@Component({
  selector: 'app-sage300-onboarding-connector',
  templateUrl: './sage300-onboarding-connector.component.html',
  styleUrls: ['./sage300-onboarding-connector.component.scss']
})
export class Sage300OnboardingConnectorComponent implements OnInit {

  isLoading: boolean = true;

  isSage300CredentialsValid: boolean = false;

  redirectLink = brandingKbArticles.topLevelArticles.SAGE300;

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps('Connect to Sage 300 CRE');

  connectSage300Form: FormGroup;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  constructor(
    private onboardingService: Sage300OnboardingService,
    private router: Router,
    private workspaceService: WorkspaceService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private connectorService: Sage300ConnectorService
  ) { }

  connectSage300() {
    this.isLoading = true;
    this.connectorService.connectSage300(this.connectSage300Form).subscribe(({sage300SetupForm, isSage300Connected}) => {
        this.connectSage300Form = sage300SetupForm;
        this.isLoading = false;
        if (isSage300Connected === true){
        this.workspaceService.setOnboardingState(Sage300OnboardingState.EXPORT_SETTINGS);
        this.router.navigate([this.onboardingSteps[1].route]);
        }
      });
  }

  private setupPage(): void {
    this.connectorService.getSage300FormGroup().subscribe((sage300SetupForm) => {
      this.connectSage300Form = sage300SetupForm;
      this.isLoading = false;
    });

    this.connectorService.getSage300TokenHealthStatus(true)
    .subscribe(isSage300CredentialsValid => {
      this.isSage300CredentialsValid = isSage300CredentialsValid;
    });
  }

ngOnInit(): void {
  this.setupPage();
}

}
