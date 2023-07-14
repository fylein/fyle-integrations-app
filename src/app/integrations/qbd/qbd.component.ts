import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QBDOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QBDWorkspace } from 'src/app/core/models/qbd/db/workspaces.model';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { IntegrationsUserService } from 'src/app/core/services/core/integrations-user.service';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

@Component({
  selector: 'app-qbd',
  templateUrl: './qbd.component.html',
  styleUrls: ['./qbd.component.scss']
})
export class QbdComponent implements OnInit {
  user: MinimalUser = this.userService.getUserProfile();;

  workspace: QBDWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private storageService: StorageService,
    private router: Router,
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
    this.isLoading = false;
    this.navigate();
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
