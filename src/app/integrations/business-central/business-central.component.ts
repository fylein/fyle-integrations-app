import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessCentralWorkspace } from 'src/app/core/models/business-central/db/business-central-workspace.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralMappingService } from 'src/app/core/services/business-central/business-central-mapping/business-central-mapping.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';

@Component({
  selector: 'app-business-central',
  templateUrl: './business-central.component.html',
  styleUrls: ['./business-central.component.scss']
})
export class BusinessCentralComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: BusinessCentralWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService,
    private mapping: BusinessCentralMappingService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/business_central') {
      const onboardingStateComponentMap = {
        [BusinessCentralOnboardingState.CONNECTION]: '/integrations/business_central/onboarding/landing',
        [BusinessCentralOnboardingState.COMPANY_SELECTION]: '/integrations/business_central/onboarding/landing',
        [BusinessCentralOnboardingState.EXPORT_SETTINGS]: '/integrations/business_central/onboarding/export_settings',
        [BusinessCentralOnboardingState.IMPORT_SETTINGS]: '/integrations/business_central/onboarding/import_settings',
        [BusinessCentralOnboardingState.ADVANCED_SETTINGS]: '/integrations/business_central/onboarding/advanced_settings',
        [BusinessCentralOnboardingState.COMPLETE]: '/integrations/business_central/main/dashboard'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private setupWorkspace(): void {
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces: BusinessCentralWorkspace) => {
      if (workspaces?.id) {
        this.storeWorkspaceAndNavigate(workspaces);
      }
    }, () => {
      this.workspaceService.postWorkspace().subscribe((workspaces: any) => {
        this.storeWorkspaceAndNavigate(workspaces);
      });
    }
    );
  }

  storeWorkspaceAndNavigate(workspace:BusinessCentralWorkspace) {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.workspaceService.importFyleAttributes(false).subscribe();
    this.mapping.importBusinessCentralAttributes(false).subscribe();
    this.isLoading = false;
    this.navigate();
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
