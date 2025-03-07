import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, QBOOnboardingState } from 'src/app/core/models/enum/enum.model';
import { QBOWorkspace } from 'src/app/core/models/qbo/db/qbo-workspace.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { QboHelperService } from 'src/app/core/services/qbo/qbo-core/qbo-helper.service';
import { QboAuthService } from 'src/app/core/services/qbo/qbo-core/qbo-auth.service';

@Component({
  selector: 'app-qbo',
  templateUrl: './qbo.component.html',
  styleUrls: ['./qbo.component.scss']
})
export class QboComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: QBOWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private helperService: HelperService,
    private qboHelperService: QboHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private qboAuthService: QboAuthService,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/qbo') {
      const onboardingStateComponentMap = {
        [QBOOnboardingState.CONNECTION]: '/integrations/qbo/onboarding/landing',
        [QBOOnboardingState.EXPORT_SETTINGS]: '/integrations/qbo/onboarding/export_settings',
        [QBOOnboardingState.IMPORT_SETTINGS]: '/integrations/qbo/onboarding/import_settings',
        [QBOOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/qbo/onboarding/advanced_settings',
        [QBOOnboardingState.CLONE_SETTINGS]: '/integrations/qbo/onboarding/clone_settings',
        [QBOOnboardingState.COMPLETE]: '/integrations/qbo/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private storeWorkspaceAndNavigate(workspace: QBOWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.qboHelperService.syncFyleDimensions().subscribe();
    this.qboHelperService.syncQBODimensions().subscribe();
    this.isLoading = false;
    this.navigate();
  }

  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.QBO);
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces: QBOWorkspace[]) => {
      if (workspaces.length) {
        this.storeWorkspaceAndNavigate(workspaces[0]);
      } else {
        this.workspaceService.postWorkspace().subscribe((workspace: QBOWorkspace) => {
          this.storeWorkspaceAndNavigate(workspace);
        });
      }
    }
    );
  }

  private handleAuthParameters(): void {
    this.route.queryParams.subscribe(params => {
      const authCode = params.code;

      console.log('in qbo component', authCode);
      if (authCode) {
        this.qboAuthService.loginWithAuthCode(authCode).subscribe(
          () => this.setupWorkspace()
        );
      } else {
        this.setupWorkspace();
      }
    });
  }

  ngOnInit(): void {
    this.handleAuthParameters();
  }

}
