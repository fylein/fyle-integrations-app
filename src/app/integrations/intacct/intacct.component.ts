import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppName, AppUrl, IntacctOnboardingState } from 'src/app/core/models/enum/enum.model';
import { IntacctWorkspace } from 'src/app/core/models/intacct/db/workspaces.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { AppcuesService } from 'src/app/core/services/integration/appcues.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';
import { SiAuthService } from 'src/app/core/services/si/si-core/si-auth.service';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { IntacctConnectorService } from 'src/app/core/services/si/si-core/si-connector.service';

@Component({
    selector: 'app-intacct',
    templateUrl: './intacct.component.html',
    styleUrls: ['./intacct.component.scss'],
    standalone: false
})
export class IntacctComponent implements OnInit {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: IntacctWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private helperService: HelperService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: SiWorkspaceService,
    private siAuthService: SiAuthService,
    private authService: AuthService,
    private intacctConnector: IntacctConnectorService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(isIntacctTokenValid?: boolean): void {
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
      this.isLoading = false;
      this.router.navigateByUrl(isIntacctTokenValid === false && ![IntacctOnboardingState.CONNECTION, IntacctOnboardingState.COMPLETE].includes(this.workspace.onboarding_state) ?  onboardingStateComponentMap[IntacctOnboardingState.LOCATION_ENTITY] : onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private routeBasedOnTokenStatus(): void {
    this.intacctConnector.getIntacctTokenHealthStatus()
    .subscribe(isIntacctCredentialsValid => {
      this.navigate(isIntacctCredentialsValid);
    });
  }

  setupWorkspace(workspace:IntacctWorkspace) {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.workspaceService.syncFyleDimensions().pipe(
      concatMap(() => this.workspaceService.syncIntacctDimensions())
    ).subscribe(() => {
      this.routeBasedOnTokenStatus();
    }, () => {
      this.isLoading = false;
    });
  }

  private getOrCreateWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.INTACCT);
    this.workspaceService.getWorkspace(this.user.org_id).subscribe((workspaces) => {
      if (workspaces.length && workspaces.length > 0) {
        this.setupWorkspace(workspaces[0]);
      } else {
        this.workspaceService.postWorkspace().subscribe((workspaces: IntacctWorkspace) => {
          this.setupWorkspace(workspaces);
        });
      }
    }
    );
  }

  private handleAuthParameters(): void {
    this.route.queryParams.subscribe(params => {
      const authCode = params.code;
      if (authCode) {
        this.siAuthService.loginWithAuthCode(authCode).subscribe(
          () => this.getOrCreateWorkspace()
        );
      } else {
        this.authService.updateUserTokens('INTACCT');
        this.getOrCreateWorkspace();
      }
    });
  }

  ngOnInit(): void {
    this.handleAuthParameters();
  }

}
