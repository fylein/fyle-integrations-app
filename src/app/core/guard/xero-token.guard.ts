import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { XeroConnectorService } from "../services/xero/xero-configuration/xero-connector.service";
import { Observable, map, catchError, of, finalize, from } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl, ToastSeverity, XeroOnboardingState } from "../models/enum/enum.model";
import { IntegrationsToastService } from "../services/common/integrations-toast.service";
import { HelperService } from "../services/common/helper.service";
import { LoadingService } from "../services/common/loading.service";


@Injectable({
  providedIn: 'root'
})
export class XeroTokenGuard  {

  constructor(
    private xeroConnectorService: XeroConnectorService,
    private router: Router,
    private toastService: IntegrationsToastService,
    private workspaceService: WorkspaceService,
    private helperService: HelperService,
    private loadingService: LoadingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.XERO);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return from(this.router.navigateByUrl('workspaces'));
      }

      this.loadingService.show();
      return this.xeroConnectorService.checkXeroTokenHealth(workspaceId).pipe(
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

      // Check onboarding state for incomplete setups
      const onboardingState: XeroOnboardingState = this.workspaceService.getOnboardingState();
      if (onboardingState !== XeroOnboardingState.COMPLETE) {
        this.toastService.displayToastMessage(ToastSeverity.ERROR, 'Oops! your xero connection expired, please connect again');
        return from(this.router.navigateByUrl('integrations/xero/onboarding/connector'));
      }

      // Check for specific error messages
      if (errorMessage === "Xero connection expired") {
        return from(this.router.navigateByUrl('integrations/xero/token_expired/dashboard'));
      }

      if (errorMessage === "Xero disconnected") {
        return from(this.router.navigateByUrl('integrations/xero/disconnect/dashboard'));
      }

      // Default: allow navigation but connection might be invalid
      return of(true);
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in XeroTokenGuard:', error);
    }

    // For non-400 errors, allow navigation but connection check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }

}