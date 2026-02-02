import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { concatMap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
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
import { LoadingService } from 'src/app/core/services/common/loading.service';

@Component({
    selector: 'app-netsuite',
    templateUrl: './netsuite.component.html',
    styleUrls: ['./netsuite.component.scss'],
    standalone: false
})
export class NetsuiteComponent implements OnInit, OnDestroy {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: NetsuiteWorkspace;

  isLoading: boolean = true;

  private isComponentLoading: boolean = true;

  private isGuardLoading: boolean = false;

  windowReference: Window;

  private destroy$ = new Subject<void>();

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
    private netsuiteConnector: NetsuiteConnectorService,
    private loadingService: LoadingService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(isNetSuiteTokenValid?: boolean): void {
    const pathName = this.windowReference.location.pathname;
    this.isComponentLoading = false;
    this.updateLoadingState();
    if (pathName === '/integrations/netsuite') {
      const onboardingStateComponentMap = {
        [NetsuiteOnboardingState.CONNECTION]: '/integrations/netsuite/onboarding/landing',
        [NetsuiteOnboardingState.SUBSIDIARY]: '/integrations/netsuite/onboarding/connector',
        [NetsuiteOnboardingState.EXPORT_SETTINGS]: '/integrations/netsuite/onboarding/export_settings',
        [NetsuiteOnboardingState.IMPORT_SETTINGS]: '/integrations/netsuite/onboarding/import_settings',
        [NetsuiteOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/netsuite/onboarding/advanced_settings',
        [NetsuiteOnboardingState.COMPLETE]: '/integrations/netsuite/main'
      };
      this.router.navigateByUrl(isNetSuiteTokenValid === false && ![NetsuiteOnboardingState.CONNECTION, NetsuiteOnboardingState.COMPLETE].includes(this.workspace.onboarding_state) ?  onboardingStateComponentMap[NetsuiteOnboardingState.SUBSIDIARY] : onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private updateLoadingState(): void {
    this.isLoading = this.isComponentLoading || this.isGuardLoading;
  }

  private routeBasedOnTokenStatus(): void {
    this.netsuiteConnector.getNetsuiteTokenHealthStatus()
    .subscribe(isNetsuiteCredentialsValid => {
      this.navigate(isNetsuiteCredentialsValid);
    });
  }

  private storeWorkspaceAndNavigate(workspace: NetsuiteWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.netsuiteHelperService.syncFyleDimensions().pipe(
      concatMap(() => this.netsuiteHelperService.syncNetsuiteDimensions())
    ).subscribe(() => {
      this.routeBasedOnTokenStatus();
    }, () => {
      this.routeBasedOnTokenStatus();
    });
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

    // Subscribe to loading service to show/hide loader during guard checks
    this.loadingService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isLoading => {
      this.isGuardLoading = isLoading;
      this.updateLoadingState();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
