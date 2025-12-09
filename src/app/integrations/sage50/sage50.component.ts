import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IntegrationsUserService } from 'src/app/core/services/common/integrations-user.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { Sage50Workspace } from 'src/app/core/models/sage50/db/sage50-workspace.model';
import { AppUrl, Sage50OnboardingState } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-sage50',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './sage50.component.html',
  styleUrl: './sage50.component.scss',
})
export class Sage50Component implements OnInit {
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private userService: IntegrationsUserService,
    private workspaceService: WorkspaceService,
    private helperService: HelperService,
  ) {}

  private navigate(): void {
    if (this.router.url === '/integrations/sage50') {
      const onboardingStateComponentMap = {
        [Sage50OnboardingState.YET_TO_START]: '/integrations/sage50/onboarding/landing',
        [Sage50OnboardingState.PRE_REQUISITES]: '/integrations/sage50/onboarding/prerequisites',
        [Sage50OnboardingState.EXPORT_SETTINGS]: '/integrations/sage50/onboarding/export_settings',
        [Sage50OnboardingState.IMPORT_SETTINGS]: '/integrations/sage50/onboarding/import_settings',
        [Sage50OnboardingState.ADVANCED_SETTINGS]: '/integrations/sage50/onboarding/advanced_settings',
        [Sage50OnboardingState.COMPLETE]: '/integrations/sage50/main/dashboard',
      };

      const onboardingState = this.workspaceService.getOnboardingState() as Sage50OnboardingState;
      this.router.navigateByUrl(onboardingStateComponentMap[onboardingState]);
    }
  }

  private storeWorkspaceAndNavigate(workspace: Sage50Workspace) {
    this.workspaceService.setWorkspaceId(workspace.id);
    this.workspaceService.setOnboardingState(workspace.onboarding_state);
    this.workspaceService.importFyleAttributes(false).subscribe();
    this.isLoading = false;
    this.navigate();
  }

  private getWorkspaces(): Observable<Sage50Workspace[]> {
    const { org_id } = this.userService.getUserProfile();
    this.helperService.setBaseApiURL(AppUrl.SAGE50);

    return this.workspaceService.getWorkspace(org_id);
  }

  private createWorkspaceAndNavigate() {
    this.helperService.setBaseApiURL(AppUrl.SAGE50);
    this.workspaceService.postWorkspace().subscribe((workspace: Sage50Workspace) => {
      this.storeWorkspaceAndNavigate(workspace);
    });
  }

  private setupWorkspace(): void {
    // Since sage50 has the same TPA ID as integrations settings API, we default to using
    // The tokens of integrations settings API. This is set in login.component.ts
    this.getWorkspaces().subscribe({
      next: (workspaces) => {
        if (workspaces && workspaces.length > 0) {
          this.storeWorkspaceAndNavigate(workspaces[0]);
        } else {
          this.createWorkspaceAndNavigate();
        }
      },
      error: () => {
        this.createWorkspaceAndNavigate();
      },
    });
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }
}
