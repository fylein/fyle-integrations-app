import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { QBOOnboardingState, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QBOCredential } from 'src/app/core/models/qbo/db/qbo-credential.model';
import { QBOConnectorModel, QBOConnectorPost } from 'src/app/core/models/qbo/qbo-configuration/qbo-connector.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboConnectorService } from 'src/app/core/services/qbo/qbo-configuration/qbo-connector.service';

@Component({
  selector: 'app-qbo-oauth-callback',
  templateUrl: './qbo-oauth-callback.component.html',
  styleUrls: ['./qbo-oauth-callback.component.scss']
})
export class QboOauthCallbackComponent implements OnInit {

  isIncorrectQBOConnectedDialogVisible: boolean = false;

  constructor(
    private qboConnectorService: QboConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService
  ) { }

  acceptWarning(isWarningAccepted: boolean): void {
    this.isIncorrectQBOConnectedDialogVisible = false;
    if (isWarningAccepted) {
      this.router.navigate([`/workspaces/onboarding/landing`]);
    }
  }

  private postQboCredentials(code: string, realmId: string): void {
    const payload: QBOConnectorPost = QBOConnectorModel.constructPayload(code, realmId);

    this.qboConnectorService.connectQBO(payload).subscribe((qboCredential: QBOCredential) => {
      this.router.navigate([`/integrations/qbo/main/dashboard`]);
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct QuickBooks Online account') {
        this.isIncorrectQBOConnectedDialogVisible = true;
      } else {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, errorMessage);
        this.router.navigate([`/integration/qbo/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code: this.route.snapshot.queryParams.code,
        realmId: this.route.snapshot.queryParams.realmId
      }
    };

    const onboardingState: QBOOnboardingState = this.workspaceService.getOnboardingState();

    if (onboardingState !== QBOOnboardingState.COMPLETE) {
      this.router.navigate(['integrations/qbo/onboarding/connector'], navigationExtras);
    } else {
      this.postQboCredentials(this.route.snapshot.queryParams.code, this.route.snapshot.queryParams.realmId);
    }
  }

  ngOnInit(): void {
    this.checkProgressAndRedirect();
  }

}
