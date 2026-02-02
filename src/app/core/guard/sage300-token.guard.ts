import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, catchError, of, finalize, from } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl, Sage300OnboardingState, ToastSeverity } from "../models/enum/enum.model";
import { HelperService } from "../services/common/helper.service";
import { Sage300ConnectorService } from "../services/sage300/sage300-configuration/sage300-connector.service";
import { LoadingService } from "../services/common/loading.service";
import { IntegrationsToastService } from "../services/common/integrations-toast.service";


@Injectable({
  providedIn: 'root'
})
export class Sage300TokenGuard  {

  constructor(
    private sage300ConnectorService: Sage300ConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private helperService: HelperService,
    private loadingService: LoadingService,
    private toastService: IntegrationsToastService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.SAGE300);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return from(this.router.navigateByUrl('workspaces'));
      }

      this.loadingService.show();
      return this.sage300ConnectorService.checkSage300TokenHealth(workspaceId).pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error);
        }),
        finalize(() => {
          this.loadingService.hide();
        })
      );
  }

  private handleError(error: HttpErrorResponse): Observable<boolean | UrlTree> {
    // Handle 400 errors (bad request - typically token issues)
    if (error.status === 400) {
      globalCacheBusterNotifier.next();

      const errorMessage = error.error?.message || '';

      // Check for specific error messages
      if (errorMessage === "Sage300 connection expired") {
        return from(this.router.navigateByUrl('integrations/sage300/token_expired/dashboard'));
      }

      // Check onboarding state for incomplete setups
      const onboardingState: Sage300OnboardingState = this.workspaceService.getOnboardingState();
      if (onboardingState !== Sage300OnboardingState.COMPLETE) {
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          'Oops! your Sage 300 connection expired, please connect again'
        );
        return from(this.router.navigateByUrl('integrations/sage300/onboarding/connector'));
      }

      // Default: allow navigation but connection might be invalid
      return of(true);
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in Sage300TokenGuard:', error);
    }

    // For non-400 errors, allow navigation but connection check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }

}