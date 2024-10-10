import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles } from 'src/app/branding/branding-config';
import { ConfigurationCta, Sage300OnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { Sage300Credential } from 'src/app/core/models/sage300/db/sage300-credentials.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { Sage300ConnectorService } from 'src/app/core/services/sage300/sage300-configuration/sage300-connector.service';
import { Sage300OnboardingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-onboarding.service';
import { Sage300MappingService } from 'src/app/core/services/sage300/sage300-mapping/sage300-mapping.service';

@Component({
  selector: 'app-sage300-onboarding-connector',
  templateUrl: './sage300-onboarding-connector.component.html',
  styleUrls: ['./sage300-onboarding-connector.component.scss']
})
export class Sage300OnboardingConnectorComponent implements OnInit {

  isLoading: boolean = true;

  redirectLink = brandingKbArticles.topLevelArticles.SAGE300;

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps('Connect to Sage 300 CRE');

  connectSage300Form: FormGroup;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingConfig = brandingConfig;

  isSage300Connected: boolean = false;

  constructor(
    private onboardingService: Sage300OnboardingService,
    private router: Router,
    private workspaceService: WorkspaceService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    private connectorService: Sage300ConnectorService,
    private toastService: IntegrationsToastService,
    private mappingService: Sage300MappingService
  ) { }

  private saveConnection() {
    const userID = this.connectSage300Form.get('userID')?.value;
    const companyID = this.connectSage300Form.get('companyID')?.value;
    const userPassword = this.connectSage300Form.get('userPassword')?.value;

    this.isLoading = true;
    this.connectorService.connectSage300({
      username: userID,
      identifier: companyID,
      password: userPassword,
      workspace: this.workspaceService.getWorkspaceId()
    }).subscribe((response) => {
      this.mappingService.importSage300Attributes(true).subscribe(() => {
        this.isLoading = false;
        this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connection Successful.');
        this.workspaceService.setOnboardingState(Sage300OnboardingState.EXPORT_SETTINGS);
        this.router.navigate([this.onboardingSteps[1].route]);
      });
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
    });
  }

  save() {
    if (this.isSage300Connected) {
      this.router.navigate([this.onboardingSteps[1].route]);
    } else {
      this.saveConnection();
    }
  }


  private setupPage(): void {
    this.connectorService.getSage300Credential().subscribe((sage300Cred: Sage300Credential) => {
      this.connectSage300Form = this.formBuilder.group({
        userID: [sage300Cred.username, Validators.required],
        companyID: [sage300Cred.identifier, Validators.required],
        userPassword: [{value: sage300Cred.password, disabled: true}]
      });
      this.isSage300Connected = true;
      this.isLoading = false;
    }, () => {
      this.connectSage300Form = this.formBuilder.group({
        userID: ['', Validators.required],
        companyID: ['', Validators.required],
        userPassword: ['', Validators.required]
      });
      this.isLoading = false;
    });
  }

ngOnInit(): void {
  this.setupPage();
}

}
