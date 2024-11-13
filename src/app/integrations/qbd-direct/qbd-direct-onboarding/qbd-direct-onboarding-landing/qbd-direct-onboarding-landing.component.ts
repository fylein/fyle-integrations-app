import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, QbdDirectOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-onboarding-landing',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './qbd-direct-onboarding-landing.component.html',
  styleUrl: './qbd-direct-onboarding-landing.component.scss'
})
export class QbdDirectOnboardingLandingComponent {

  appName: AppName = AppName.QBD_DIRECT;

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  embedVideoLink = brandingDemoVideoLinks.onboarding.QBD_DIRECT;

  isQbdConnectionInProgress = false;

  readonly brandingContent = brandingContent.qbd_direct.landing;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

  connectQbdDirect() {
    this.isQbdConnectionInProgress = true;
    this.workspaceService.updateWorkspaceOnboardingState({"onboarding_state": QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.workspaceService.setOnboardingState(workspaceResponse.onboarding_state);
      this.isQbdConnectionInProgress = false;
      this.router.navigate([`/integrations/qbd_direct/onboarding/pre_requisite/`]);
    });
  }

}
