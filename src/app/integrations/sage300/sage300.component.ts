import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, Sage300OnboardingState } from 'src/app/core/models/enum/enum.model';
import { Sage300Workspace } from 'src/app/core/models/sage300/db/sage300-workspace.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { Sage300MappingService } from 'src/app/core/services/sage300/sage300-mapping/sage300-mapping.service';

@Component({
  selector: 'app-sage300',
  templateUrl: './sage300.component.html',
  styleUrls: ['./sage300.component.scss']
})
export class Sage300Component implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: Sage300Workspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService,
    private mapping: Sage300MappingService,
    private helperService: HelperService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/sage300') {
      const onboardingStateComponentMap = {
        [Sage300OnboardingState.CONNECTION]: '/integrations/sage300/onboarding/landing',
        [Sage300OnboardingState.EXPORT_SETTINGS]: '/integrations/sage300/onboarding/export_settings',
        [Sage300OnboardingState.IMPORT_SETTINGS]: '/integrations/sage300/onboarding/import_settings',
        [Sage300OnboardingState.ADVANCED_SETTINGS]: '/integrations/sage300/onboarding/advanced_settings',
        [Sage300OnboardingState.COMPLETE]: '/integrations/sage300/main/dashboard'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.SAGE300);
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspace: Sage300Workspace) => {
      if (workspace) {
        this.storeWorkspaceAndNavigate(workspace);
      }
    }, () => {
      this.workspaceService.postWorkspace().subscribe((workspaces: any) => {
        this.storeWorkspaceAndNavigate(workspaces);
      });
    }
    );
  }

  storeWorkspaceAndNavigate(workspace:Sage300Workspace) {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.workspaceService.importFyleAttributes(false).subscribe();
    this.mapping.importSage300Attributes(false).subscribe();
    this.isLoading = false;
    this.navigate();
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
