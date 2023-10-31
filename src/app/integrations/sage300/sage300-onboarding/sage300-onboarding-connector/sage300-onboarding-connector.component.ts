import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigurationCta, RedirectLink, Sage300OnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { OnboardingStepper } from 'src/app/core/models/misc/onboarding-stepper.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { Sage300ConnectorService } from 'src/app/core/services/sage300/sage300-configuration/sage300-connector.service';
import { Sage300OnboardingService } from 'src/app/core/services/sage300/sage300-configuration/sage300-onboarding.service';

@Component({
  selector: 'app-sage300-onboarding-connector',
  templateUrl: './sage300-onboarding-connector.component.html',
  styleUrls: ['./sage300-onboarding-connector.component.scss']
})
export class Sage300OnboardingConnectorComponent implements OnInit {

  isLoading: boolean;

  redirectLink = RedirectLink.SAGE300;

  onboardingSteps: OnboardingStepper[] = this.onboardingService.getOnboardingSteps('Connect to Sage 300 CRE');

  connectSage300Form: FormGroup;

  saveInProgress: boolean = false;

  ConfigurationCtaText = ConfigurationCta;

  constructor(
    private onboardingService: Sage300OnboardingService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private formBuilder: FormBuilder,
    private connectorService: Sage300ConnectorService,
    private toastService: IntegrationsToastService
  ) { }

  save() {
    const userID = this.connectSage300Form.value.userID;
    const companyID = this.connectSage300Form.value.companyID;
    const userPassword = this.connectSage300Form.value.userPassword;

    this.isLoading = true;
    this.connectorService.connectSage300({
      user_id: userID,
      indentifier: companyID,
      password: userPassword
    }).subscribe((response) => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Connection Successful.');
      this.workspaceService.setOnboardingState(Sage300OnboardingState.EXPORT_SETTINGS);
      this.router.navigate([this.onboardingSteps[1].route]);
    }, () => {
      this.isLoading = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Error while connecting, please try again later.');
    });
  }

  private setupPage(): void {
    this.isLoading = true;
    this.connectSage300Form = this.formBuilder.group({
      userID: ['', Validators.required],
      companyID: ['', Validators.required],
      userPassword: ['', Validators.required]
    });
    this.isLoading = false;
  }

ngOnInit(): void {
  this.setupPage();
}

}
