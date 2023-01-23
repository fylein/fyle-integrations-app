import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { OnboardingState } from 'src/app/core/models/enum/enum.model';
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

  isLoading: boolean;

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
        [OnboardingState.CONNECTION]: '/integrations/qbd/onboarding/landing',
        [OnboardingState.EXPORT_SETTINGS]: '/integrations/qbd/onboarding/export_settings',
        [OnboardingState.FIELD_MAPPING]: '/integrations/qbd/onboarding/import_settings',
        [OnboardingState.ADVANCED_CONFIGURATION]: '/integrations/qbd/onboarding/advanced_settings',
        [OnboardingState.COMPLETE]: '/integrations/qbd/main'
      };

      this.router.navigateByUrl(onboardingStateComponentMap[OnboardingState.CONNECTION]);
    }
  }

  getOrCreateWorkspace(): Promise<Workspace> {
    return this.workspaceService.qbdGetWorkspace(this.user.org_id).toPromise().then((workspaces) => {
      if (workspaces?.id) {
        return workspaces;
      }

      return this.workspaceService.qbdCreateWorkspace().toPromise().then((workspaces: any) => {
        return workspaces;
      });
    });
  }

  setupWorkspace() {
    this.user = this.userService.qbdGetUserProfile();
    this.getOrCreateWorkspace().then((workspace: Workspace) => {
      this.workspace = workspace;
      this.storageService.set('workspaceId', this.workspace.id);
      this.storageService.set('onboardingState', 'Landing');
      this.storageService.set('workspaceCreatedAt', workspace.created_at);
      this.isLoading = false;
      this.navigate();
    });
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
