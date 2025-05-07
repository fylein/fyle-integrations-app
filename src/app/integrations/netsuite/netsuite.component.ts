import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, NetsuiteOnboardingState } from 'src/app/core/models/enum/enum.model';
import { NetsuiteWorkspace } from 'src/app/core/models/netsuite/db/netsuite-workspace.model';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { NetsuiteHelperService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-helper.service';
import { NetsuiteAuthService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-auth.service';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { NetsuiteConnectorService } from 'src/app/core/services/netsuite/netsuite-core/netsuite-connector.service';

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
    private route: ActivatedRoute,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService,
    private nsAuthService: NetsuiteAuthService,
    private authService: AuthService,
    private helperService: HelperService,
    private netsuiteConnector: NetsuiteConnectorService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(isNetSuiteTokenValid?: boolean): void {
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

      this.router.navigateByUrl(isNetSuiteTokenValid === false ?  onboardingStateComponentMap[NetsuiteOnboardingState.SUBSIDIARY] : onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private routeBasedOnTokenStatus(): void {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus()
    .then(isNetsuiteCredentialsValid => {
      this.navigate(isNetsuiteCredentialsValid);
    });
  }

  private storeWorkspaceAndNavigate(workspace: NetsuiteWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.netsuiteHelperService.syncFyleDimensions().subscribe();
    this.netsuiteHelperService.syncNetsuiteDimensions().subscribe();
    this.isLoading = false;
    this.routeBasedOnTokenStatus();
  }


  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.NETSUITE);
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

  private handleAuthParameters(): void {
    this.route.queryParams.subscribe(params => {
      const authCode = params.code;

      if (authCode) {
        this.nsAuthService.loginWithAuthCode(authCode).subscribe(
          () => this.setupWorkspace()
        );
      } else {
        this.authService.updateUserTokens('NETSUITE');
        this.setupWorkspace();
      }
    });
  }

  ngOnInit(): void {
    this.handleAuthParameters();
  }
}
