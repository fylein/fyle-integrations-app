import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, QbdDirectOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';

@Component({
  selector: 'app-qbd-direct',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './qbd-direct.component.html',
  styleUrl: './qbd-direct.component.scss'
})
export class QbdDirectComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: QbdDirectWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private helperService: HelperService,
    private qbdDirectHelperService: QbdDirectHelperService,
    private router: Router,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/qbd_direct') {
      const onboardingStateComponentMap = {
        [QbdDirectOnboardingState.YET_TO_START]: '/integrations/qbd_direct/onboarding/landing',
        [QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES]: '/integrations/qbd_direct/onboarding/pre_requisite',
        [QbdDirectOnboardingState.CONNECTION]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.PENDING_QWC_UPLOAD]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.INCORRECT_COMPANY_PATH]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.INCORRECT_PASSWORD]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.EXPORT_SETTINGS]: '/integrations/qbd_direct/onboarding/export_settings',
        [QbdDirectOnboardingState.IMPORT_SETTINGS]: '/integrations/qbd_direct/onboarding/import_settings',
        [QbdDirectOnboardingState.ADVANCED_SETTINGS]: '/integrations/qbd_direct/onboarding/advanced_settings',
        [QbdDirectOnboardingState.COMPLETE]: '/integrations/qbd_direct/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private storeWorkspaceAndNavigate(workspace: QbdDirectWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.qbdDirectHelperService.importAttribuites(false);
    this.isLoading = false;
    this.navigate();
  }

  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.QBD_DIRECT);
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces: QbdDirectWorkspace[]) => {
      if (workspaces.length) {
        this.storeWorkspaceAndNavigate(workspaces[0]);
      } else {
        this.workspaceService.postWorkspace().subscribe((workspace: QbdDirectWorkspace) => {
          this.storeWorkspaceAndNavigate(workspace);
        });
      }
    }
    );
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
