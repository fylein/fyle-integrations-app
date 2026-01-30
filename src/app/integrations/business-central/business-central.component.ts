import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { BusinessCentralWorkspace } from 'src/app/core/models/business-central/db/business-central-workspace.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, BusinessCentralOnboardingState } from 'src/app/core/models/enum/enum.model';
import { BusinessCentralMappingService } from 'src/app/core/services/business-central/business-central-core/business-central-mapping.service';
import { AuthService } from 'src/app/core/services/common/auth.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { LoadingService } from 'src/app/core/services/common/loading.service';

@Component({
    selector: 'app-business-central',
    templateUrl: './business-central.component.html',
    styleUrls: ['./business-central.component.scss'],
    standalone: false
})
export class BusinessCentralComponent implements OnInit, OnDestroy {

  user: MinimalUser = this.userService.getUserProfile();

  workspace: BusinessCentralWorkspace;

  isLoading: boolean = true;

  private isComponentLoading: boolean = true;

  private isGuardLoading: boolean = false;

  windowReference: Window;

  private destroy$ = new Subject<void>();

  constructor(
    private helperService: HelperService,
    private mapping: BusinessCentralMappingService,
    private router: Router,
    private storageService: StorageService,
    private userService: IntegrationsUserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    private authService: AuthService,
    private loadingService: LoadingService
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
    this.helperService.setBaseApiURL(AppUrl.BUSINESS_CENTRAL);
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
    this.isComponentLoading = false;
    this.updateLoadingState();
    this.navigate();
  }

  private updateLoadingState(): void {
    this.isLoading = this.isComponentLoading || this.isGuardLoading;
  }

  ngOnInit(): void {
    this.authService.updateUserTokens('BUSINESS_CENTRAL');
    this.setupWorkspace();

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
