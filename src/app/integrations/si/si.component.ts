import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppName, AppUrl, IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntacctWorkspace } from 'src/app/core/models/si/db/workspaces.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { AppcuesService } from 'src/app/core/services/integration/appcues.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-si',
  templateUrl: './si.component.html',
  styleUrls: ['./si.component.scss']
})
export class SiComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: IntacctWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private appcuesService: AppcuesService,
    private helperService: HelperService,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: SiWorkspaceService,
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/intacct') {
      const onboardingStateComponentMap = {
        [IntacctOnboardingState.CONNECTION]: '/integrations/intacct/onboarding/landing',
        [IntacctOnboardingState.LOCATION_ENTITY]: '/integrations/intacct/onboarding/connector',
        [IntacctOnboardingState.EXPORT_SETTINGS]: '/integrations/intacct/onboarding/export_settings',
        [IntacctOnboardingState.IMPORT_SETTINGS]: '/integrations/intacct/onboarding/import_settings',
        [IntacctOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/intacct/onboarding/advanced_settings',
        [IntacctOnboardingState.COMPLETE]: '/integrations/intacct/main/dashboard'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  setupWorkspace(workspace:IntacctWorkspace) {
    this.workspace = workspace;
    this.storageService.set('si.workspaceId', this.workspace.id);
    this.storageService.set('si.onboardingState', this.workspace.onboarding_state);
    this.appcuesService.initialiseAppcues(AppName.INTACCT, this.workspace.created_at);
    this.workspaceService.syncFyleDimensions().subscribe();
    this.workspaceService.syncIntacctDimensions().subscribe();
    this.isLoading = false;
    this.navigate();
  }

  private getOrCreateWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.INTACCT);
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces) => {
      if (workspaces.length) {
        this.setupWorkspace(workspaces[0]);
      } else {
        this.workspaceService.postWorkspace().subscribe((workspaces: IntacctWorkspace) => {
          this.setupWorkspace(workspaces);
        });
      }
    }
    );
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (window as any).Appcues && (window as any).Appcues.page();
      }
    });
    this.getOrCreateWorkspace();
  }

}
