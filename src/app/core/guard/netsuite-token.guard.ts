import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, catchError, of, finalize, from } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { globalCacheBusterNotifier } from "ts-cacheable";
import { WorkspaceService } from "../services/common/workspace.service";
import { AppUrl, NetsuiteOnboardingState, ToastSeverity } from "../models/enum/enum.model";
import { HelperService } from "../services/common/helper.service";
import { NetsuiteConnectorService } from "../services/netsuite/netsuite-core/netsuite-connector.service";
import { LoadingService } from "../services/common/loading.service";
import { IntegrationsToastService } from "../services/common/integrations-toast.service";


@Injectable({
  providedIn: 'root'
})
export class NetsuiteTokenGuard  {

  constructor(
    private netsuiteConnectorService: NetsuiteConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService,
    private helperService: HelperService,
    private loadingService: LoadingService,
    private toastService: IntegrationsToastService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.helperService.setBaseApiURL(AppUrl.NETSUITE);
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return from(this.router.navigateByUrl('workspaces'));
      }

      this.loadingService.show();
      return this.netsuiteConnectorService.checkNetsuiteTokenHealth(workspaceId).pipe(
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
      if (errorMessage === "Netsuite connection expired") {
        return from(this.router.navigateByUrl('integrations/netsuite/token_expired/dashboard'));
      }

      // Check onboarding state for incomplete setups
      const onboardingState: NetsuiteOnboardingState = this.workspaceService.getOnboardingState();
      if (onboardingState !== NetsuiteOnboardingState.COMPLETE) {
        this.toastService.displayToastMessage(
          ToastSeverity.ERROR,
          'Oops! your NetSuite connection expired, please connect again'
        );
        return from(this.router.navigateByUrl('integrations/netsuite/onboarding/connector'));
      }

      // Default: allow navigation but connection might be invalid
      return of(true);
    }

    // Handle other errors (network, server errors, etc.)
    // Log unexpected errors for debugging
    if (error.status !== 0) { // 0 typically means network error
      console.error('Unexpected error in NetsuiteTokenGuard:', error);
    }

    // For non-400 errors, allow navigation but connection check failed
    // The component can handle displaying appropriate error messages
    return of(true);
  }

}