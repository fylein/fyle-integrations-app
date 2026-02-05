import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, catchError, of, finalize, from } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl, IntacctOnboardingState, ToastSeverity } from "../models/enum/enum.model";
import { HelperService } from "../services/common/helper.service";
import { IntacctConnectorService } from "../services/si/si-core/si-connector.service";
import { LoadingService } from "../services/common/loading.service";
import { IntegrationsToastService } from "../services/common/integrations-toast.service";


@Injectable({
  providedIn: 'root'
})
export class IntacctTokenGuard  {

  constructor(
    private intacctConnectorService: IntacctConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private helperService: HelperService,
    private loadingService: LoadingService,
    private toastService: IntegrationsToastService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.INTACCT);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return from(this.router.navigateByUrl('workspaces'));
      }

      this.loadingService.show();
      return this.intacctConnectorService.checkIntacctTokenHealth(workspaceId).pipe(
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
      if (errorMessage === "Intacct connection expired") {
        return from(this.router.navigateByUrl('integrations/intacct/token_expired/dashboard'));
      }

      // Check onboarding state for incomplete setups
      const onboardingState: IntacctOnboardingState = this.workspaceService.getOnboardingState();
      if (onboardingState !== IntacctOnboardingState.COMPLETE) {
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          'Oops! your Sage Intacct connection expired, please connect again'
        );
        return from(this.router.navigateByUrl('integrations/intacct/onboarding/connector'));
      }

      // Default: allow navigation but connection might be invalid
      return of(true);
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in IntacctTokenGuard:', error);
    }

    // For non-400 errors, allow navigation but connection check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }

}