
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingConfig, brandingDemoVideoLinks, brandingKbArticles } from 'src/app/branding/branding-config';
import { AppName, QbdDirectOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { BrandingService } from 'src/app/core/services/common/branding.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-qbd-direct-onboarding-landing',
    imports: [SharedModule, TranslocoModule],
    templateUrl: './qbd-direct-onboarding-landing.component.html',
    styleUrl: './qbd-direct-onboarding-landing.component.scss'
})
export class QbdDirectOnboardingLandingComponent implements OnInit {

  appName: AppName = AppName.QBD_DIRECT;

  brandingConfig = brandingConfig;

  redirectLink = brandingConfig.brandId !== 'co' ? brandingKbArticles.topLevelArticles.QBD_DIRECT : '';

  embedVideoLink = brandingDemoVideoLinks.onboarding.QBD_DIRECT;

  isQbdConnectionInProgress = false;

  isAssistedSetupSlotBooked: boolean;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private userService: UserService,
    private trackingService: TrackingService,
    public brandingService: BrandingService
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
    this.trackingService.onQbdDirectLandingPageOpen();
    const user = this.userService.getUserProfile();
    this.workspaceService.getWorkspace(user.org_id).subscribe((workspaces: QbdDirectWorkspace[]) => {
      if (workspaces.length && workspaces[0]?.onboarding_state !== QbdDirectOnboardingState.YET_TO_START) {
        this.router.navigate([`/integrations/qbd_direct`]);
      } else {
        if (workspaces.length && workspaces[0].assisted_setup_requested_at){
          this.isAssistedSetupSlotBooked = true;
        }
      }
    });
  }

}
