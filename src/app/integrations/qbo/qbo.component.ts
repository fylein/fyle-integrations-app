import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
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
import { AuthService } from 'src/app/core/services/common/auth.service';
import { concatMap, filter, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-qbo',
    templateUrl: './qbo.component.html',
    styleUrls: ['./qbo.component.scss'],
    standalone: false
})
export class QboComponent implements OnInit, OnDestroy {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: QBOWorkspace;

  isLoading: boolean = true;

  windowReference: Window;

  private destroy$ = new Subject<void>();
  private isGuardCheckInProgress = false;

  constructor(
    private helperService: HelperService,
    private qboHelperService: QboHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private qboAuthService: QboAuthService,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private windowService: WindowService,
    private authService: AuthService
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
      this.isLoading = false;
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private storeWorkspaceAndNavigate(workspace: QBOWorkspace): void {
    this.workspace = workspace;
    this.storageService.set('workspaceId', this.workspace.id);
    this.storageService.set('onboarding-state', this.workspace.onboarding_state);
    this.qboHelperService.syncFyleDimensions().pipe(
      concatMap(() => this.qboHelperService.syncQBODimensions())
    ).subscribe(() => {
      this.navigate();
    });
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

      if (authCode) {
        this.qboAuthService.loginWithAuthCode(authCode).subscribe(
          () => this.setupWorkspace()
        );
      } else {
        this.authService.updateUserTokens('QBO');
        this.setupWorkspace();
      }
    });
  }

  ngOnInit(): void {
    this.handleAuthParameters();
    
    // Listen to router events to show loader during guard checks
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart || event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loader when navigation starts to a guarded route
        if (event.url.includes('/integrations/qbo/main')) {
          this.isLoading = true;
          this.isGuardCheckInProgress = true;
        }
      } else if (event instanceof NavigationEnd) {
        // Hide loader when navigation completes (guard check is done)
        // This handles both successful navigation and redirects from the guard
        if (this.isGuardCheckInProgress) {
          this.isGuardCheckInProgress = false;
          // Small delay to ensure smooth transition
          setTimeout(() => {
            this.isLoading = false;
          }, 100);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
