import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { Workspace } from 'src/app/core/models/qbd/db/workspaces.model';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { QbdUserService } from 'src/app/core/services/qbd/qbd-core/qbd-user.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-qbd',
  templateUrl: './qbd.component.html',
  styleUrls: ['./qbd.component.scss']
})
export class QbdComponent implements OnInit {
  user: MinimalUser;

  workspace: Workspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: QbdUserService,
    private workspaceService: QbdWorkspaceService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/qbd') {
      const onboardingStateComponentMap = {
        [QBDOnboardingState.CONNECTION]: '/integrations/qbd/onboarding/landing',
        [QBDOnboardingState.EXPORT_SETTINGS]: '/integrations/qbd/onboarding/export_settings',
        [QBDOnboardingState.FIELD_MAPPING]: '/integrations/qbd/onboarding/field_mappings',
        [QBDOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/qbd/onboarding/advanced_settings',
        [QBDOnboardingState.COMPLETE]: '/integrations/qbd/main'
      };

      this.router.navigateByUrl(onboardingStateComponentMap[QBDOnboardingState.CONNECTION]);
    }
  }

  getOrCreateWorkspace(): void {
    this.workspaceService.getQBDWorkspace(this.user.org_id).subscribe((workspaces) => {
      if (workspaces?.id) {
        this.workspace = workspaces;
        this.storageService.set('workspaceId', this.workspace.id);
        // TODO change it later to workspace.onboarding_state
        this.storageService.set('QBDOnboardingState', 'Landing');
        this.isLoading = false;
        this.navigate();
      }
    }, (error) => {
      this.workspaceService.postQBDWorkspace().subscribe((workspaces: any) => {
        this.workspace = workspaces;
        this.storageService.set('workspaceId', this.workspace.id);
        // TODO change it later to workspace.onboarding_state
        this.storageService.set('QBDOnboardingState', 'Landing');
        this.isLoading = false;
        this.navigate();
      });
    }
    );
  }

  setupWorkspace() {
    this.user = this.userService.qbdGetUserProfile();
      this.getOrCreateWorkspace();
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
