import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AppUrl, XeroOnboardingState } from 'src/app/core/models/enum/enum.model';
import { XeroWorkspace } from 'src/app/core/models/xero/db/xero-workspace.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { StorageService } from 'src/app/core/services/common/storage.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { XeroHelperService } from 'src/app/core/services/xero/xero-core/xero-helper.service';
import { XeroAuthService } from 'src/app/core/services/xero/xero-core/xero-auth.service';
import { AuthService } from 'src/app/core/services/common/auth.service';

@Component({
    selector: 'app-xero',
    templateUrl: './xero.component.html',
    styleUrls: ['./xero.component.scss'],
    standalone: false
})
export class XeroComponent implements OnInit {

  user: MinimalUser;

  isLoading: boolean = true;

  workspace: XeroWorkspace;

  windowReference: Window;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private xeroHelperService: XeroHelperService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    private helperService: HelperService,
    private xeroAuthService: XeroAuthService,
    private authService: AuthService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/integrations/xero') {
      const onboardingStateComponentMap = {
        [XeroOnboardingState.CONNECTION]: '/integrations/xero/onboarding/landing',
        [XeroOnboardingState.TENANT_MAPPING]: '/integrations/xero/onboarding/connector',
        [XeroOnboardingState.EXPORT_SETTINGS]: '/integrations/xero/onboarding/export_settings',
        [XeroOnboardingState.IMPORT_SETTINGS]: '/integrations/xero/onboarding/import_settings',
        [XeroOnboardingState.ADVANCED_CONFIGURATION]: '/integrations/xero/onboarding/advanced_settings',
        [XeroOnboardingState.CLONE_SETTINGS]: '/integrations/xero/onboarding/clone_settings',
        [XeroOnboardingState.COMPLETE]: '/integrations/xero/main'
      };
      this.isLoading = false;
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private getOrCreateWorkspace(): Promise<XeroWorkspace> {
    return this.workspaceService.getWorkspace(this.user.org_id).toPromise().then((workspaces: XeroWorkspace[]) => {
      if (workspaces.length > 0) {
        return workspaces[0];
      }

      return this.workspaceService.postWorkspace().toPromise().then((workspace: XeroWorkspace) => {
        return workspace;
      });
    });
  }

  private setupWorkspace(): void {
    this.helperService.setBaseApiURL(AppUrl.XERO);
    this.user = this.userService.getUserProfile();
    this.getOrCreateWorkspace().then((workspace: XeroWorkspace) => {
      this.workspace = workspace;
      const xeroShortCode = this.workspace.xero_short_code;
      const currency = {
        fyle_currency: workspace.fyle_currency,
        xero_currency: workspace.xero_currency
      };
      this.storageService.set('workspaceId', this.workspace.id);
      this.storageService.set('onboarding-state', this.workspace.onboarding_state);
      this.storageService.set('currency', currency);
      this.storageService.set('xeroShortCode', xeroShortCode);
      this.xeroHelperService.syncFyleDimensions().subscribe();
      this.xeroHelperService.syncXeroDimensions().subscribe();
      this.navigate();
    });
  }

  private handleAuthParameters(): void {
    this.route.queryParams.subscribe(params => {
      const authCode = params.code;

      if (authCode) {
        this.xeroAuthService.login(authCode).subscribe(
          () => this.setupWorkspace()
        );
      } else {
        this.authService.updateUserTokens('XERO');
        this.setupWorkspace();
      }
    });
  }

  ngOnInit(): void {
    this.handleAuthParameters();
  }


}
