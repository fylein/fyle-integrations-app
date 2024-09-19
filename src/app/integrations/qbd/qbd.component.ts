import type { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import type { Router } from '@angular/router';
import type { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import type { QBDWorkspace } from 'src/app/core/models/qbd/db/qbd-workspace.model';
import type { StorageService } from 'src/app/core/services/common/storage.service';
import type { WindowService } from 'src/app/core/services/common/window.service';
import type { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import type { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import type { HelperService } from 'src/app/core/services/common/helper.service';

@Component({
  selector: 'app-qbd',
  templateUrl: './qbd.component.html',
  styleUrls: ['./qbd.component.scss']
})
export class QbdComponent implements OnInit {
  user: MinimalUser = this.userService.getUserProfile();

  workspace: QBDWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private helperService: HelperService,
    private router: Router,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
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
        [QBDOnboardingState.EXPORT_SETTINGS]: '/integrations/qbd/onboarding/landing',
        [QBDOnboardingState.FIELD_MAPPINGS]: '/integrations/qbd/onboarding/field_mappings',
        [QBDOnboardingState.ADVANCED_SETTINGS]: '/integrations/qbd/onboarding/advanced_settings',
        [QBDOnboardingState.COMPLETE]: '/integrations/qbd/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.QBD);
    this.workspaceService.getQBDWorkspace(this.user.org_id).subscribe((workspaces) => {
      if (workspaces?.id) {
        this.workspaceSetting(workspaces);
      }
    }, (error) => {
      this.workspaceService.postQBDWorkspace().subscribe((workspaces: any) => {
        this.workspaceSetting(workspaces);
      });
    }
    );
  }

  workspaceSetting(workspace:QBDWorkspace) {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('QBDOnboardingState', this.workspace.onboarding_state);
    this.workspaceService.syncFyleDimensions().subscribe();
    this.isLoading = false;
    this.navigate();
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
