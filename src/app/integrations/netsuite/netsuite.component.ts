import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { NetsuiteOnboardingState } from 'src/app/core/models/enum/enum.model';
import { NetsuiteWorkspace } from 'src/app/core/models/netsuite/db/netsuite-workspace.model';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';


@Component({
  selector: 'app-netsuite',
  templateUrl: './netsuite.component.html',
  styleUrls: ['./netsuite.component.scss']
})
export class NetsuiteComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: NetsuiteWorkspace;

  isLoading: boolean = true;

  windowReference: Window;


  constructor(
    private netsuiteHelperService: NetsuiteHelperService,
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
    if (pathName === '/integrations/netsuite') {
      const onboardingStateComponentMap = {
        [NetsuiteOnboardingState.CONNECTION]: '/integrations/netsuite/onboarding/landing',
        [NetsuiteOnboardingState.SUBSIDIARY]: '/integrations/netsuite/onboarding/connector',
        [NetsuiteOnboardingState.EXPORT_SETTINGS]: '/integrations/netsuite/onboarding/export_settings',
        [NetsuiteOnboardingState.IMPORT_SETTINGS]: '/integrations/netsuite/onboarding/import_settings',
        [NetsuiteOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/netsuite/onboarding/advanced_settings',
        [NetsuiteOnboardingState.COMPLETE]: '/integrations/netsuite/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private storeWorkspaceAndNavigate(workspace: NetsuiteWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.netsuiteHelperService.syncFyleDimensions().subscribe();
    this.netsuiteHelperService.syncNetsuiteDimensions().subscribe();
    this.isLoading = false;
    this.navigate();
  }


  private setupWorkspace(): void {

    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces: NetsuiteWorkspace[]) => {
      if (workspaces.length) {
        this.storeWorkspaceAndNavigate(workspaces[0]);
      } else {
        this.workspaceService.postWorkspace().subscribe((workspace: NetsuiteWorkspace) => {
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
