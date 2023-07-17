import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntacctWorkspace } from 'src/app/core/models/si/db/workspaces.model';
import { IntegrationsUserService } from 'src/app/core/services/core/integrations-user.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SiSettingsService } from 'src/app/core/services/si/si-settings.service';

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

  settingsService : SiSettingsService;

  connectSageIntacct = true;

  companyName: string;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: IntegrationsUserService,
    private workspaceService: SiWorkspaceService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/intacct') {
      const onboardingStateComponentMap = {
        [IntacctOnboardingState.CONNECTION]: '/integrations/intacct/onboarding/connector',
        [IntacctOnboardingState.LOCATION_ENTITY]: '/integrations/intacct/onboarding/connector',
        [IntacctOnboardingState.EXPORT_SETTINGS]: '/integrations/intacct/onboarding/export_settings',
        [IntacctOnboardingState.IMPORT_SETTINGS]: '/integrations/intacct/onboarding/import_settings',
        [IntacctOnboardingState.ADVANCED_SETTINGS]: '/integrations/intacct/onboarding/advanced_settings',
        [IntacctOnboardingState.COMPLETE]: '/integrations/intacct/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  workspaceSetting(workspace:IntacctWorkspace) {
    this.workspace = workspace;
    this.storageService.set('si.workspaceId', this.workspace.id);
    this.storageService.set('si.onboardingState', this.workspace.onboarding_state);
    this.isLoading = false;
    this.navigate();
  }

  getSageIntacctCompanyName() {
    const that = this;
    that.settingsService.getSageIntacctCredentials(that.workspace.id).subscribe(res => {
      that.connectSageIntacct = false;
      that.companyName = res && res.si_company_name;
    });
  }

  private setupWorkspace(): void {
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces) => {
      if (workspaces?.id) {
        this.workspaceSetting(workspaces);
      }
    }, (error) => {
      this.workspaceService.postWorkspace().subscribe((workspaces: any) => {
        this.workspaceSetting(workspaces);
      });
    }
    );
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
