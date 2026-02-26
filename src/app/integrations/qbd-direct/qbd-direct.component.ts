import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppName, AppUrl, QbdDirectOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QbdDirectWorkspace } from 'src/app/core/models/qbd-direct/db/qbd-direct-workspaces.model';
import { QwcRegenerationFlowType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { NavigationLockService } from 'src/app/core/services/common/navigation-lock.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { AppcuesService } from 'src/app/core/services/integration/appcues.service';
import { QbdDirectAdvancedSettingsService } from 'src/app/core/services/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.service';
import { QbdDirectHelperService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-helper.service';
import { QbdDirectQwcLastVisitedFlowService } from 'src/app/core/services/qbd-direct/qbd-direct-core/qbd-direct-qwc-last-visited-flow.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-qbd-direct',
    imports: [RouterModule, SharedModule],
    templateUrl: './qbd-direct.component.html',
    styleUrl: './qbd-direct.component.scss'
})
export class QbdDirectComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: QbdDirectWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private appcuesService: AppcuesService,
    private helperService: HelperService,
    private qbdDirectHelperService: QbdDirectHelperService,
    private router: Router,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService,
    private authService: AuthService,
    private qbdDirectAdvancedSettingsService: QbdDirectAdvancedSettingsService,
    private qbdDirectQwcLastVisitedFlowService: QbdDirectQwcLastVisitedFlowService,
    private navigationLockService: NavigationLockService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    const connectionStates = [
      QbdDirectOnboardingState.PENDING_QWC_UPLOAD,
      QbdDirectOnboardingState.INCORRECT_COMPANY_PATH,
      QbdDirectOnboardingState.INCORRECT_PASSWORD,
      QbdDirectOnboardingState.COMPANY_NAME_MISMATCH,
      QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS,
      QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE
    ];

    // In Fyle theme, these states mean that we are either onboarding
    // Or in the process of regenerating the QWC file.
    // Check if advanced settings exists to find out which one
    if (brandingFeatureConfig.qbdDirect.allowQwcRegeneration && connectionStates.includes(this.workspace.onboarding_state)) {
      this.qbdDirectAdvancedSettingsService.getQbdAdvancedSettings().subscribe({
        next: () => {
          // 200: advanced settings exists - we are regenerating the QWC file
          const lastVisitedFlow = this.qbdDirectQwcLastVisitedFlowService.get();
          const flowRoute = lastVisitedFlow === QwcRegenerationFlowType.EXISTING ? 'existing' : 'new';
          this.router.navigateByUrl(`/integrations/qbd_direct/main/configuration/qwc_file/${flowRoute}`);
          this.navigationLockService.lock();
          this.isLoading = false;
        },
        error: () => {
          // 404: advanced settings does not exist - we are onboarding
          this.router.navigateByUrl('/integrations/qbd_direct/onboarding/connector');
          this.isLoading = false;
        }
      });
      return;
    }

    if (pathName === '/integrations/qbd_direct') {
      const onboardingStateComponentMap: Record<QbdDirectOnboardingState, string> = {
        [QbdDirectOnboardingState.YET_TO_START]: '/integrations/qbd_direct/onboarding/landing',
        [QbdDirectOnboardingState.CONFIRM_PRE_REQUISITES]: '/integrations/qbd_direct/onboarding/pre_requisite',
        [QbdDirectOnboardingState.CONNECTION]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.PENDING_QWC_UPLOAD]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.INCORRECT_COMPANY_PATH]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.INCORRECT_PASSWORD]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.COMPANY_NAME_MISMATCH]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.DESTINATION_SYNC_IN_PROGRESS]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.DESTINATION_SYNC_COMPLETE]: '/integrations/qbd_direct/onboarding/connector',
        [QbdDirectOnboardingState.EXPORT_SETTINGS]: '/integrations/qbd_direct/onboarding/export_settings',
        [QbdDirectOnboardingState.IMPORT_SETTINGS]: '/integrations/qbd_direct/onboarding/import_settings',
        [QbdDirectOnboardingState.ADVANCED_SETTINGS]: '/integrations/qbd_direct/onboarding/advanced_settings',
        [QbdDirectOnboardingState.COMPLETE]: '/integrations/qbd_direct/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
    this.isLoading = false;
  }

  private storeWorkspaceAndNavigate(workspace: QbdDirectWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.appcuesService.initialiseAppcues(AppName.QBD_DIRECT, this.workspace.created_at);
    this.workspaceService.importFyleAttributes(false).subscribe();
    this.qbdDirectHelperService.importQBDAttributes(false).subscribe();
    this.navigate();
  }

  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.QBD_DIRECT);
    this.authService.updateUserTokens('QBD_DIRECT');
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
