import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingConfig, brandingContent, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, QbdDirectOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-qbd-direct-onboarding-landing',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './qbd-direct-onboarding-landing.component.html',
  styleUrl: './qbd-direct-onboarding-landing.component.scss'
})
export class QbdDirectOnboardingLandingComponent implements OnInit {

  appName: AppName = AppName.QBD_DIRECT;

  brandingConfig = brandingConfig;

  redirectLink = brandingKbArticles.topLevelArticles.QBD_DIRECT;

  embedVideoLink = brandingDemoVideoLinks.onboarding.QBD_DIRECT;

  isQbdConnectionInProgress = false;

  isAssistedSetupSlotBooked: boolean;

  readonly brandingContent = brandingContent.qbd_direct.landing;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private userService: UserService
  ) { }

  connectQbdDirect() {
    this.isQbdConnectionInProgress = true;
    this.workspaceService.updateWorkspaceOnboardingState({"onboarding_state": QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES}).subscribe((workspaceResponse: QbdDirectWorkspace) => {
      this.workspaceService.setOnboardingState(workspaceResponse.onboarding_state);
      this.isQbdConnectionInProgress = false;
      this.router.navigate([`/integrations/qbd_direct/onboarding/pre_requisite/`]);
    });
  }

  ngOnInit(): void {
    const user = this.userService.getUserProfile();
    this.workspaceService.getWorkspace(user.org_id).subscribe((workspaces: QbdDirectWorkspace[]) => {
      if (workspaces.length && workspaces[0]?.onboarding_state !== QbdDirectOnboardingState.YET_TO_START) {
        this.router.navigate([`/integrations/qbd_direct`]);
      } else {
        if (workspaces[0].assisted_setup_requested_at){
          this.isAssistedSetupSlotBooked = true;
        }
      }
    });
  }

}
